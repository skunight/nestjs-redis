import type { ModuleMetadata } from '@nestjs/common/interfaces';
import type { Redis, RedisOptions } from 'ioredis';
export interface RedisModuleOptions extends RedisOptions {
    clientName?: string;
    url?: string;
    onClientReady?(client: Redis): Promise<void>;
}
export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (...args: any[]) => RedisModuleOptions | RedisModuleOptions[] | Promise<RedisModuleOptions> | Promise<RedisModuleOptions[]>;
    inject?: any[];
}
