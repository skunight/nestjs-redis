"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAsyncClusterOptions = exports.createCluster = exports.RedisClusterError = void 0;
const ioredis_1 = require("ioredis");
const uuid = require("uuid");
const cluster_constants_1 = require("./cluster.constants");
class RedisClusterError extends Error {
}
exports.RedisClusterError = RedisClusterError;
function getCluster(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { onClusterReady, nodes } = options, opt = __rest(options, ["onClusterReady", "nodes"]);
        const cluster = new ioredis_1.Cluster(nodes, opt);
        if (onClusterReady) {
            onClusterReady(cluster);
        }
        return cluster;
    });
}
exports.createCluster = () => ({
    provide: cluster_constants_1.REDIS_CLUSTER,
    useFactory: (options) => __awaiter(void 0, void 0, void 0, function* () {
        const clusters = new Map();
        let defaultKey = uuid();
        if (Array.isArray(options)) {
            yield Promise.all(options.map((o) => __awaiter(void 0, void 0, void 0, function* () {
                const key = o.name || defaultKey;
                if (clusters.has(key)) {
                    throw new RedisClusterError(`${o.name || 'default'} cluster already exists`);
                }
                clusters.set(key, yield getCluster(o));
            })));
        }
        else {
            if (options.name && options.name.length !== 0) {
                defaultKey = options.name;
            }
            clusters.set(defaultKey, yield getCluster(options));
        }
        return {
            defaultKey,
            clusters,
            size: clusters.size,
        };
    }),
    inject: [cluster_constants_1.CLUSTER_MODULE_OPTIONS],
});
exports.createAsyncClusterOptions = (options) => ({
    provide: cluster_constants_1.CLUSTER_MODULE_OPTIONS,
    useFactory: options.useFactory,
    inject: options.inject,
});
