"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Redis = require("ioredis");
const redis_constants_1 = require("./redis.constants");
const uuid = require("uuid");
class RedisClientError extends Error {
}
exports.RedisClientError = RedisClientError;
exports.createClient = () => ({
    provide: redis_constants_1.REDIS_CLIENT,
    useFactory: (options) => {
        const clients = new Map();
        const defaultKey = uuid();
        if (Array.isArray(options)) {
            for (let o of options) {
                if (o.name) {
                    if (clients.has(o.name)) {
                        throw new RedisClientError(`client ${o.name} is exists`);
                    }
                    clients.set(o.name, new Redis(o));
                }
                else {
                    if (clients.has(defaultKey)) {
                        throw new RedisClientError('default client is exists');
                    }
                    clients.set(defaultKey, new Redis(o));
                }
            }
        }
        else {
            clients.set(defaultKey, new Redis(options));
        }
        return {
            defaultKey, clients, size: clients.size
        };
    },
    inject: [redis_constants_1.REDIS_MODULE_OPTIONS]
});
exports.createAsyncClientOptions = (options) => ({
    provide: redis_constants_1.REDIS_MODULE_OPTIONS,
    useFactory: options.useFactory,
    inject: options.inject
});
