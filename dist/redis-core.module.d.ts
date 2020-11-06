import type { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';
import { DynamicModule, OnModuleDestroy } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
export declare class RedisCoreModule implements OnModuleDestroy {
    private readonly options;
    private readonly moduleRef;
    constructor(options: RedisModuleOptions | RedisModuleOptions[], moduleRef: ModuleRef);
    static register(options: RedisModuleOptions | RedisModuleOptions[]): DynamicModule;
    static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule;
    onModuleDestroy(): void;
}
