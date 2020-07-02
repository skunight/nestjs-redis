import { Injectable, Inject } from '@nestjs/common';
import { REDIS_CLUSTER } from './cluster.constants';
import { Redis } from 'ioredis';
import { RedisClusterProvider, RedisClusterError } from './cluster.provider';

@Injectable()
export class RedisClusterService {
  constructor(
    @Inject(REDIS_CLUSTER) private readonly provider: RedisClusterProvider,
  ) {}

  getCluster(name?: string): Redis {
    if (!name) {
      name = this.provider.defaultKey;
    }

    if (!this.provider.clusters.has(name)) {
      throw new RedisClusterError(`cluster ${name} does not exist`);
    }
    return this.provider.clusters.get(name);
  }

  getClusters(): Map<string, Redis> {
    return this.provider.clusters;
  }
}
