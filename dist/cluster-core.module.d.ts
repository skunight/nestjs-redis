import { DynamicModule, OnModuleDestroy } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { RedisClusterModuleAsyncOptions, RedisClusterModuleOptions } from './cluster.interface';
export declare class ClusterCoreModule implements OnModuleDestroy {
    private readonly options;
    private readonly moduleRef;
    constructor(options: RedisClusterModuleOptions | RedisClusterModuleOptions[], moduleRef: ModuleRef);
    static register(options: RedisClusterModuleOptions | RedisClusterModuleOptions[]): DynamicModule;
    static forRootAsync(options: RedisClusterModuleAsyncOptions): DynamicModule;
    onModuleDestroy(): void;
}
