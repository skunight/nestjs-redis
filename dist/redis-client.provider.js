"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAsyncClientOptions = exports.createClient = exports.RedisClientError = void 0;
const Redis = require("ioredis");
const uuid_1 = require("uuid");
const redis_constants_1 = require("./redis.constants");
class RedisClientError extends Error {
}
exports.RedisClientError = RedisClientError;
async function getClient(options) {
    const { onClientReady, url, ...opt } = options;
    const client = url ? new Redis.Redis(url) : new Redis.Redis(opt);
    if (onClientReady) {
        onClientReady(client);
    }
    return client;
}
const createClient = () => ({
    provide: redis_constants_1.REDIS_CLIENT,
    useFactory: async (options) => {
        const clients = new Map();
        let defaultKey = (0, uuid_1.v4)();
        if (Array.isArray(options)) {
            await Promise.all(options.map(async (o) => {
                const key = o.name || defaultKey;
                if (clients.has(key)) {
                    throw new RedisClientError(`${o.name || 'default'} client is exists`);
                }
                clients.set(key, await getClient(o));
            }));
        }
        else {
            if (options.name && options.name.length !== 0) {
                defaultKey = options.name;
            }
            clients.set(defaultKey, await getClient(options));
        }
        return {
            defaultKey,
            clients,
            size: clients.size,
        };
    },
    inject: [redis_constants_1.REDIS_MODULE_OPTIONS],
});
exports.createClient = createClient;
const createAsyncClientOptions = (options) => ({
    provide: redis_constants_1.REDIS_MODULE_OPTIONS,
    useFactory: options.useFactory,
    inject: options.inject,
});
exports.createAsyncClientOptions = createAsyncClientOptions;
