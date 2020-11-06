import { Cluster } from 'ioredis';
import { RedisClusterProvider } from './cluster.provider';
export declare class RedisClusterService {
    private readonly provider;
    constructor(provider: RedisClusterProvider);
    getCluster(clientName?: string): Cluster;
    getClusters(): Map<string, Cluster>;
}
