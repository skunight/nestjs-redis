import { Redis } from 'ioredis';
import { Provider } from '@nestjs/common';
import { ClusterModuleAsyncOptions, ClusterModuleOptions } from './cluster.interface';
export declare class RedisClusterError extends Error {
}
export interface ClusterProvider {
    defaultKey: string;
    clusters: Map<string, Redis>;
    size: number;
}
export declare const createCluster: () => Provider;
export declare const createAsyncClusterOptions: (options: ClusterModuleAsyncOptions) => {
    provide: symbol;
    useFactory: (...args: any[]) => ClusterModuleOptions | Promise<ClusterModuleOptions> | ClusterModuleOptions[] | Promise<ClusterModuleOptions[]>;
    inject: any[];
};
