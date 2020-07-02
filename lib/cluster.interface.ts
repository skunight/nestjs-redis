import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Redis, ClusterOptions } from 'ioredis';

export interface ClusterModuleOptions extends ClusterOptions {
  name?: string;
  nodes: (string | number | object)[];
  onClusterReady?(cluster: Redis): Promise<void>;
}

export interface ClusterModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) =>
    | ClusterModuleOptions
    | ClusterModuleOptions[]
    | Promise<ClusterModuleOptions>
    | Promise<ClusterModuleOptions[]>;
  inject?: any[];
}
