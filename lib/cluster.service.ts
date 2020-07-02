import { Injectable, Inject } from '@nestjs/common';
import { REDIS_CLUSTER } from './cluster.constants';
import { Cluster } from 'ioredis';
import { ClusterProvider, RedisClusterError } from './cluster.provider';

@Injectable()
export class ClusterService {
  constructor(
    @Inject(REDIS_CLUSTER) private readonly provider: ClusterProvider,
  ) {}

  getCluster(name?: string): Cluster {
    if (!name) {
      name = this.provider.defaultKey;
    }

    if (!this.provider.clusters.has(name)) {
      throw new RedisClusterError(`cluster ${name} does not exist`);
    }
    return this.provider.clusters.get(name);
  }

  getClusters(): Map<string, Cluster> {
    return this.provider.clusters;
  }
}
