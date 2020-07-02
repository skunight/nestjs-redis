import { Redis } from 'ioredis';
import { ClusterProvider } from './cluster.provider';
export declare class ClusterService {
    private readonly provider;
    constructor(provider: ClusterProvider);
    getCluster(name?: string): Redis;
    getClusters(): Map<string, Redis>;
}
