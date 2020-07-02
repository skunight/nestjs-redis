import { DynamicModule, OnModuleDestroy } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ClusterModuleAsyncOptions, ClusterModuleOptions } from './cluster.interface';
export declare class ClusterCoreModule implements OnModuleDestroy {
    private readonly options;
    private readonly moduleRef;
    constructor(options: ClusterModuleOptions | ClusterModuleOptions[], moduleRef: ModuleRef);
    static register(options: ClusterModuleOptions | ClusterModuleOptions[]): DynamicModule;
    static forRootAsync(options: ClusterModuleAsyncOptions): DynamicModule;
    onModuleDestroy(): void;
}
