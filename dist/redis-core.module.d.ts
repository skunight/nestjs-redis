import { DynamicModule } from '@nestjs/common';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';
export declare class RedisCoreModule {
    static register(options: RedisModuleOptions | RedisModuleOptions[]): DynamicModule;
    static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule;
}
