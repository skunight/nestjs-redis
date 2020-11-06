import { Cluster } from 'ioredis';
import { Provider } from '@nestjs/common';
import { RedisClusterModuleAsyncOptions, RedisClusterModuleOptions } from './cluster.interface';
export declare class RedisClusterError extends Error {
}
export interface RedisClusterProvider {
    defaultKey: string;
    clusters: Map<string, Cluster>;
    size: number;
}
export declare const createCluster: () => Provider;
export declare const createAsyncClusterOptions: (options: RedisClusterModuleAsyncOptions) => {
    provide: symbol;
    useFactory: (...args: any[]) => RedisClusterModuleOptions | Promise<RedisClusterModuleOptions> | RedisClusterModuleOptions[] | Promise<RedisClusterModuleOptions[]>;
    inject: any[];
};
