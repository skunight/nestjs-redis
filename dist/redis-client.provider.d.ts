import * as Redis from "ioredis";
import { RedisModuleOptions, RedisModuleAsyncOptions } from "./redis.interface";
export declare const createClient: () => {
    provide: symbol;
    useFactory: (options: RedisModuleOptions) => Redis.Redis;
    inject: symbol[];
};
export declare const createAsyncClientOptions: (options: RedisModuleAsyncOptions) => {
    provide: symbol;
    useFactory: (...args: any[]) => RedisModuleOptions | Promise<RedisModuleOptions>;
    inject: any[];
};
