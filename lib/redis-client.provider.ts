import * as Redis from "ioredis"
import { REDIS_CLIENT, REDIS_MODULE_OPTIONS } from './redis.constants';
import { RedisModuleOptions, RedisModuleAsyncOptions } from "./redis.interface";
import * as uuid from 'uuid'

export class RedisClientError extends Error {}
export interface RedisClient {
  defaultKey:string,
  clients: Map<string, Redis.Redis>,
  size:number
}

export const createClient = () => ({
  provide: REDIS_CLIENT,
  useFactory:(options: RedisModuleOptions | RedisModuleOptions[]) => {
    const clients = new Map<string,Redis.Redis>()
    const defaultKey = uuid()
    if(Array.isArray(options)) {
      for(let o of options) {
        if(o.name) {
          if(clients.has(o.name)) {
            throw new RedisClientError(`client ${o.name} is exists`)
          }
          clients.set(o.name, new Redis(o))
        } else {
          if(clients.has(defaultKey)) {
            throw new RedisClientError('default client is exists')
          }
          clients.set(defaultKey, new Redis(o))
        }
      }
    } else {
      clients.set(defaultKey,new Redis(options))
    }
    return {
      defaultKey,clients,size:clients.size
    }
  },
  inject:[REDIS_MODULE_OPTIONS]
})

export const createAsyncClientOptions = (options:RedisModuleAsyncOptions) => ({
  provide: REDIS_MODULE_OPTIONS,
  useFactory: options.useFactory,
  inject: options.inject
})
  