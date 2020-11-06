import type { ModuleMetadata } from '@nestjs/common/interfaces';
import type { Cluster, ClusterOptions } from 'ioredis';

export interface RedisClusterModuleOptions extends ClusterOptions {
  clientName?: string;
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
