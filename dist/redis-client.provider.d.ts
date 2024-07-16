import { Redis } from 'ioredis';
import { Provider } from '@nestjs/common';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';
export declare class RedisClientError extends Error {
}
export interface RedisClient {
    defaultKey: string;
    clients: Map<string, Redis>;
    size: number;
}
export declare const createClient: () => Provider;
export declare const createAsyncClientOptions: (options: RedisModuleAsyncOptions) => {
    provide: symbol;
    useFactory: (...args: any[]) => RedisModuleOptions | RedisModuleOptions[] | Promise<RedisModuleOptions> | Promise<RedisModuleOptions[]>;
    inject: any[];
};
