"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Redis = require("ioredis");
const redis_constants_1 = require("./redis.constants");
exports.createClient = () => ({
    provide: redis_constants_1.REDIS_CLIENT,
    useFactory: (options) => {
        return new Redis(options);
    },
    inject: [redis_constants_1.REDIS_MODULE_OPTIONS]
});
