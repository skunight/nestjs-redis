import * as Redis from "ioredis";
import { RedisModuleOptions, RedisModuleAsyncOptions } from "./redis.interface";
export declare class RedisClientError extends Error {
}
export interface RedisClient {
    defaultKey: string;
    clients: Map<string, Redis.Redis>;
    size: number;
}
export declare const createClient: () => {
    provide: symbol;
    useFactory: (options: RedisModuleOptions | RedisModuleOptions[]) => {
        defaultKey: string;
        clients: Map<string, Redis.Redis>;
        size: number;
    };
    inject: symbol[];
};
export declare const createAsyncClientOptions: (options: RedisModuleAsyncOptions) => {
    provide: symbol;
    useFactory: (...args: any[]) => RedisModuleOptions | Promise<RedisModuleOptions> | RedisModuleOptions[] | Promise<RedisModuleOptions[]>;
    inject: any[];
};
