import { Cluster } from 'ioredis';
import * as uuid from 'uuid';
import { Provider } from '@nestjs/common';

import { REDIS_CLUSTER, CLUSTER_MODULE_OPTIONS } from './cluster.constants';
import {
  ClusterModuleAsyncOptions,
  ClusterModuleOptions,
} from './cluster.interface';

export class RedisClusterError extends Error {}
export interface ClusterProvider {
  defaultKey: string;
  clusters: Map<string, Cluster>;
  size: number;
}

async function getCluster(options: ClusterModuleOptions): Promise<Cluster> {
  const { onClusterReady, nodes, ...opt } = options;
  const cluster: Cluster = (new Cluster(nodes, opt) as unknown) as Cluster;

  if (onClusterReady) {
    onClusterReady(cluster);
  }

  return cluster;
}

export const createCluster = (): Provider => ({
  provide: REDIS_CLUSTER,
  useFactory: async (
    options: ClusterModuleOptions | ClusterModuleOptions[],
  ): Promise<ClusterProvider> => {
    const clusters: Map<string, Cluster> = new Map<string, Cluster>();
    let defaultKey = uuid();

    if (Array.isArray(options)) {
      await Promise.all(
        options.map(async o => {
          const key: string = o.name || defaultKey;
          if (clusters.has(key)) {
            throw new RedisClusterError(
              `${o.name || 'default'} cluster already exists`,
            );
          }
          clusters.set(key, await getCluster(o));
        }),
      );
    } else {
      if (options.name && options.name.length !== 0) {
        defaultKey = options.name;
      }
      clusters.set(defaultKey, await getCluster(options));
    }

    return {
      defaultKey,
      clusters,
      size: clusters.size,
    };
  },
  inject: [CLUSTER_MODULE_OPTIONS],
});

export const createAsyncClusterOptions = (
  options: ClusterModuleAsyncOptions,
) => ({
  provide: CLUSTER_MODULE_OPTIONS,
  useFactory: options.useFactory,
  inject: options.inject,
});
