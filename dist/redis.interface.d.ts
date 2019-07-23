import { ModuleMetadata } from '@nestjs/common/interfaces';
import { RedisOptions } from 'ioredis';
export interface RedisModuleOptions extends RedisOptions {
    name?: string;
    url?: string;
}
export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (...args: any[]) => RedisModuleOptions | RedisModuleOptions[] | Promise<RedisModuleOptions> | Promise<RedisModuleOptions[]>;
    inject?: any[];
}
