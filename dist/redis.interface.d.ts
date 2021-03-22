import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Redis, RedisOptions } from 'ioredis';
export interface RedisModuleOptions extends RedisOptions {
    name?: string;
    url?: string;
    onClientReady?(client: Redis): void;
}
export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (...args: any[]) => RedisModuleOptions | RedisModuleOptions[] | Promise<RedisModuleOptions> | Promise<RedisModuleOptions[]>;
    inject?: any[];
}
