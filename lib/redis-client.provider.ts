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

export const createClient = () => ({
  provide: REDIS_CLIENT,
  useFactory: (options: RedisModuleOptions | RedisModuleOptions[]) => {
    const clients = new Map<string, Redis.Redis>();
    const defaultKey = uuid();
    if (Array.isArray(options)) {
      for (const o of options) {
        if (o.name) {
          if (clients.has(o.name)) {
            throw new RedisClientError(`client ${o.name} is exists`);
          }
          if (o.url) {
            clients.set(o.name, new Redis(o.url));
          } else {
            clients.set(o.name, new Redis(o));
          }
        } else {
          if (clients.has(defaultKey)) {
            throw new RedisClientError('default client is exists');
          }
          if (o.url) {
            clients.set(defaultKey, new Redis(o.url));
          } else {
            clients.set(defaultKey, new Redis(o));
          }
        }
      }
    } else {
      if (options.url) {
        clients.set(defaultKey, new Redis(options.url));
      } else {
        clients.set(defaultKey, new Redis(options));
      }
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
