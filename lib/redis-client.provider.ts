import * as Redis from 'ioredis';
import * as uuid from 'uuid';

import { REDIS_CLIENT, REDIS_MODULE_OPTIONS } from './redis.constants';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';

export class RedisClientError extends Error {}
export interface RedisClient {
  defaultKey: string;
  clients: Map<string, Redis.Redis>;
  size: number;
}

function getClient(options: RedisModuleOptions, key: string): Redis.Redis {
  const { errorHandler, url, ...opt } = options;

  const client = url ? new Redis(url) : new Redis(opt);
  if (errorHandler) {
    client.on('error', err => errorHandler(err, client));
  }

  return client;
}

export const createClient = () => ({
  provide: REDIS_CLIENT,
  useFactory: (options: RedisModuleOptions | RedisModuleOptions[]) => {
    const clients = new Map<string, Redis.Redis>();
    const defaultKey = uuid();

    if (Array.isArray(options)) {
      for (const o of options) {
        const key = o.name || defaultKey;
        if (clients.has(key)) {
          throw new RedisClientError(`client ${o.name} or default client is exists`);
        }
        clients.set(key, getClient(o, key));
      }
    } else {
      clients.set(defaultKey, getClient(options, defaultKey));
    }

    return {
      defaultKey,
      clients,
      size: clients.size,
    };
  },
  inject: [REDIS_MODULE_OPTIONS],
});

export const createAsyncClientOptions = (options: RedisModuleAsyncOptions) => ({
  provide: REDIS_MODULE_OPTIONS,
  useFactory: options.useFactory,
  inject: options.inject,
});
