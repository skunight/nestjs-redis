import * as IORedis from 'ioredis';
import * as uuid from 'uuid';
import { Provider } from '@nestjs/common';

import { REDIS_MODULE_OPTIONS, REDIS_CLIENTS } from './redis.constants';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';

export const defaultClientFacory = (options: RedisModuleOptions): RedisClient => {
  return options.url ? new IORedis(options.url) : new IORedis(options);
}

export class RedisClientError extends Error {}

export interface RedisClients {
  defaultKey: string;
  clients: Map<string, RedisClient>;
  size: number;
}

export type RedisClient = any;

async function getClient(options: RedisModuleOptions): Promise<RedisClient> {
  const { onClientReady, clientFactory } = options;
  const client = clientFactory ? clientFactory(options) : defaultClientFacory(options);
  if (onClientReady) {
    onClientReady(client)
  }
  return client;
}

export const createClient = (): Provider => ({
  provide: REDIS_CLIENTS,
  useFactory: async (options: RedisModuleOptions | RedisModuleOptions[]): Promise<RedisClients> => {
    const clients = new Map<string, RedisClient>();
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
      if (options.name && options.name.length !== 0) {
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
