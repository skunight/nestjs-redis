import { ModuleMetadata } from '@nestjs/common/interfaces';
import { RedisOptions } from 'ioredis';
export interface RedisModuleOptions extends RedisOptions {
}
export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (...args: any[]) => RedisModuleOptions | Promise<RedisModuleOptions>;
    inject?: any[];
}
