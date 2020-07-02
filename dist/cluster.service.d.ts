import { Redis } from 'ioredis';
import { RedisClusterProvider } from './cluster.provider';
export declare class RedisClusterService {
    private readonly provider;
    constructor(provider: RedisClusterProvider);
    getCluster(name?: string): Redis;
    getClusters(): Map<string, Redis>;
}
