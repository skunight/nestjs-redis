import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Redis, RedisOptions } from 'ioredis';
import { RedisClient, RedisClients } from './redis-client.provider';

export interface RedisModuleOptions extends RedisOptions {
  name?: string;
  url?: string;
  onClientReady?(client: RedisClient): Promise<void>;
  clientFactory?: (options: RedisModuleOptions) => RedisClient;
}

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) =>
    | RedisModuleOptions
    | RedisModuleOptions[]
    | Promise<RedisModuleOptions>
    | Promise<RedisModuleOptions[]>;
  inject?: any[];
}
