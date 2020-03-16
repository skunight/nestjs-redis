"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Redis = require("ioredis");
const uuid = require("uuid");
const redis_constants_1 = require("./redis.constants");
class RedisClientError extends Error {
}
exports.RedisClientError = RedisClientError;
function getClient(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { onClientReady, url } = options, opt = __rest(options, ["onClientReady", "url"]);
        const client = url ? new Redis(url) : new Redis(opt);
        if (onClientReady) {
            onClientReady(client);
        }
        return client;
    });
}
exports.createClient = () => ({
    provide: redis_constants_1.REDIS_CLIENT,
    useFactory: (options) => __awaiter(this, void 0, void 0, function* () {
        const clients = new Map();
        const defaultKey = uuid();
        if (Array.isArray(options)) {
            yield Promise.all(options.map((o) => __awaiter(this, void 0, void 0, function* () {
                const key = o.name || defaultKey;
                if (clients.has(key)) {
                    throw new RedisClientError(`${o.name || 'default'} client is exists`);
                }
                clients.set(key, yield getClient(o));
            })));
        }
        else {
            clients.set(defaultKey, yield getClient(options));
        }
        return {
            defaultKey,
            clients,
            size: clients.size,
        };
    }),
    inject: [redis_constants_1.REDIS_MODULE_OPTIONS],
});
exports.createAsyncClientOptions = (options) => ({
    provide: redis_constants_1.REDIS_MODULE_OPTIONS,
    useFactory: options.useFactory,
    inject: options.inject,
});
