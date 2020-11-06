import { DynamicModule } from '@nestjs/common';
import type { RedisClusterModuleAsyncOptions, RedisClusterModuleOptions } from './cluster.interface';
export declare class RedisClusterModule {
    static register(options: RedisClusterModuleOptions | RedisClusterModuleOptions[]): DynamicModule;
    static forRootAsync(options: RedisClusterModuleAsyncOptions): DynamicModule;
}
