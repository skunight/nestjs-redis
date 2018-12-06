import * as Redis from "ioredis"
import { REDIS_CLIENT, REDIS_MODULE_OPTIONS } from './redis.constants';
import { RedisModuleOptions, RedisModuleAsyncOptions } from "./redis.interface";

export const createClient = () => ({
  provide: REDIS_CLIENT,
  useFactory:(options: RedisModuleOptions) => {
    return new Redis(options)
  },
  inject:[REDIS_MODULE_OPTIONS]
})

export const createAsyncClientOptions = (options:RedisModuleAsyncOptions) => ({
  provide: REDIS_MODULE_OPTIONS,
  useFactory: options.useFactory,
  inject: options.inject
})
  