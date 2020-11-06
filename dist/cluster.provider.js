"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAsyncClusterOptions = exports.createCluster = exports.RedisClusterError = void 0;
const uuid_1 = require("uuid");
const ioredis_1 = require("ioredis");
const cluster_constants_1 = require("./cluster.constants");
class RedisClusterError extends Error {
}
exports.RedisClusterError = RedisClusterError;
async function getCluster(options) {
    const { onClusterReady, nodes, ...opt } = options;
    const cluster = new ioredis_1.Cluster(nodes, opt);
    if (onClusterReady) {
        onClusterReady(cluster);
    }
    return cluster;
}
exports.createCluster = () => ({
    provide: cluster_constants_1.REDIS_CLUSTER,
    useFactory: async (options) => {
        const clusters = new Map();
        let defaultKey = uuid_1.v4();
        if (Array.isArray(options)) {
            await Promise.all(options.map(async (o) => {
                const key = o.clientName || defaultKey;
                if (clusters.has(key)) {
                    throw new RedisClusterError(`${o.clientName || 'default'} cluster already exists`);
                }
                clusters.set(key, await getCluster(o));
            }));
        }
        else {
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
    inject: [cluster_constants_1.REDIS_CLUSTER_MODULE_OPTIONS],
});
exports.createAsyncClusterOptions = (options) => ({
    provide: cluster_constants_1.REDIS_CLUSTER_MODULE_OPTIONS,
    useFactory: options.useFactory,
    inject: options.inject,
});
//# sourceMappingURL=cluster.provider.js.map