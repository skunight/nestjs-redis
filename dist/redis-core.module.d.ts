import { DynamicModule, OnModuleDestroy } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';
export declare class RedisCoreModule implements OnModuleDestroy {
    private readonly options;
    private readonly moduleRef;
    constructor(options: RedisModuleOptions | RedisModuleOptions[], moduleRef: ModuleRef);
    static register(options: RedisModuleOptions | RedisModuleOptions[]): DynamicModule;
    static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule;
    onModuleDestroy(): void;
}
