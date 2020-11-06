import { Injectable, Inject } from '@nestjs/common';
import { REDIS_CLUSTER } from './cluster.constants';
import { Cluster } from 'ioredis';
import { RedisClusterProvider, RedisClusterError } from './cluster.provider';

@Injectable()
export class RedisClusterService {
  constructor(
    @Inject(REDIS_CLUSTER) private readonly provider: RedisClusterProvider,
  ) {}

  getCluster(clientName?: string): Cluster {
    if (!clientName) {
      clientName = this.provider.defaultKey;
    }

    if (!this.provider.clusters.has(clientName)) {
      throw new RedisClusterError(`cluster ${clientName} does not exist`);
    }
    return this.provider.clusters.get(clientName);
  }

  getClusters(): Map<string, Cluster> {
    return this.provider.clusters;
  }
}
