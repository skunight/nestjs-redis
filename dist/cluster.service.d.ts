import { Cluster } from 'ioredis';
import { ClusterProvider } from './cluster.provider';
export declare class ClusterService {
    private readonly provider;
    constructor(provider: ClusterProvider);
    getCluster(name?: string): Cluster;
    getClusters(): Map<string, Cluster>;
}
