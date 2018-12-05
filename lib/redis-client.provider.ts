import * as Redis from "ioredis"
import { REDIS_CLIENT, REDIS_MODULE_OPTIONS } from './redis.constants';
import { RedisModuleOptions } from "./redis.interface";

export const createClient = () => ({
  provide: REDIS_CLIENT,
  useFactory:(options: RedisModuleOptions) => {
    return new Redis(options)
  },
  inject:[REDIS_MODULE_OPTIONS]
})