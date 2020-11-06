import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Cluster, ClusterOptions } from 'ioredis';

export interface RedisClusterModuleOptions extends ClusterOptions {
  name?: string;
  nodes: (string | number | object)[];
  onClusterReady?(cluster: Cluster): Promise<void>;
}

export interface RedisClusterModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) =>
    | RedisClusterModuleOptions
    | RedisClusterModuleOptions[]
    | Promise<RedisClusterModuleOptions>
    | Promise<RedisClusterModuleOptions[]>;
  inject?: any[];
}
