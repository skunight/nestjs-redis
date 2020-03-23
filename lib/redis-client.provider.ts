import * as Redis from 'ioredis';
import * as uuid from 'uuid';
import { Provider } from '@nestjs/common';

import { REDIS_CLIENT, REDIS_MODULE_OPTIONS } from './redis.constants';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';

export class RedisClientError extends Error {}
export interface RedisClient {
  defaultKey: string;
  clients: Map<string, Redis.Redis>;
  size: number;
}

async function getClient(options: RedisModuleOptions): Promise<Redis.Redis> {
  const { onClientReady, url, ...opt } = options;
  const client = url ? new Redis(url) : new Redis(opt);
  if (onClientReady) {
    onClientReady(client)
  }
  return client;
}

export const createClient = (): Provider => ({
  provide: REDIS_CLIENT,
  useFactory: async (options: RedisModuleOptions | RedisModuleOptions[]): Promise<RedisClient> => {
    const clients = new Map<string, Redis.Redis>();
    let defaultKey = uuid();

    if (Array.isArray(options)) {
      await Promise.all(
        options.map(async o => {
          const key = o.name || defaultKey;
          if (clients.has(key)) {
            throw new RedisClientError(`${o.name || 'default'} client is exists`);
          }
          clients.set(key, await getClient(o));
        }),
      );
    } else {
      if (options.name.length !== 0) {
        defaultKey = options.name;
      }
      clients.set(defaultKey, await getClient(options));
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
