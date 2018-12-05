import { DynamicModule } from '@nestjs/common';
import { RedisModuleOptions } from './redis.interface';
export declare class RedisModule {
    static register(options: RedisModuleOptions): DynamicModule;
}
