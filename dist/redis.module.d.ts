import type { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';
import { DynamicModule } from '@nestjs/common';
export declare class RedisModule {
    static register(options: RedisModuleOptions | RedisModuleOptions[]): DynamicModule;
    static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule;
}
