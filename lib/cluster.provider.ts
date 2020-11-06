import { v4 as uuid } from 'uuid';
import { Provider } from '@nestjs/common';
import { Cluster } from 'ioredis';

import type {
  RedisClusterModuleAsyncOptions,
  RedisClusterModuleOptions,
} from './cluster.interface';
import {
  REDIS_CLUSTER,
  REDIS_CLUSTER_MODULE_OPTIONS,
} from './cluster.constants';

export class RedisClusterError extends Error {}
export interface RedisClusterProvider {
  defaultKey: string;
  clusters: Map<string, Cluster>;
  size: number;
}

async function getCluster(options: RedisClusterModuleOptions): Promise<Cluster> {
  const { onClusterReady, nodes, ...opt } = options;
  const cluster = new Cluster(nodes, opt);

  if (onClusterReady) {
    onClusterReady(cluster);
  }

  return cluster;
}

export const createCluster = (): Provider => ({
  provide: REDIS_CLUSTER,
  useFactory: async (
    options: RedisClusterModuleOptions | RedisClusterModuleOptions[],
  ): Promise<RedisClusterProvider> => {
    const clusters: Map<string, Cluster> = new Map<string, Cluster>();
    let defaultKey = uuid();

    if (Array.isArray(options)) {
      await Promise.all(
        options.map(async o => {
          const key: string = o.clientName || defaultKey;
          if (clusters.has(key)) {
            throw new RedisClusterError(
              `${o.clientName || 'default'} cluster already exists`,
            );
          }
          clusters.set(key, await getCluster(o));
        }),
      );
    } else {
      if (options.clientName && options.clientName.length !== 0) {
        defaultKey = options.clientName;
      }
      clusters.set(defaultKey, await getCluster(options));
    }

    return {
      defaultKey,
      clusters,
      size: clusters.size,
    };
  },
  inject: [REDIS_CLUSTER_MODULE_OPTIONS],
});

export const createAsyncClusterOptions = (
  options: RedisClusterModuleAsyncOptions,
) => ({
  provide: REDIS_CLUSTER_MODULE_OPTIONS,
  useFactory: options.useFactory,
  inject: options.inject,
});
