"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RedisCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCoreModule = void 0;
const common_1 = require("@nestjs/common");
const redis_client_provider_1 = require("./redis-client.provider");
const redis_constants_1 = require("./redis.constants");
const redis_service_1 = require("./redis.service");
let RedisCoreModule = exports.RedisCoreModule = RedisCoreModule_1 = class RedisCoreModule {
    constructor(options, redisClient) {
        this.options = options;
        this.redisClient = redisClient;
    }
    static register(options) {
        return {
            module: RedisCoreModule_1,
            providers: [
                (0, redis_client_provider_1.createClient)(),
                { provide: redis_constants_1.REDIS_MODULE_OPTIONS, useValue: options },
            ],
            exports: [redis_service_1.RedisService],
        };
    }
    static forRootAsync(options) {
        return {
            module: RedisCoreModule_1,
            imports: options.imports,
            providers: [(0, redis_client_provider_1.createClient)(), (0, redis_client_provider_1.createAsyncClientOptions)(options)],
            exports: [redis_service_1.RedisService],
        };
    }
    onModuleDestroy() {
        const closeConnection = ({ clients, defaultKey }) => (options) => {
            const name = options.name || defaultKey;
            const client = clients.get(name);
            if (client && !options.keepAlive) {
                client.disconnect();
            }
        };
        const closeClientConnection = closeConnection(this.redisClient);
        if (Array.isArray(this.options)) {
            this.options.forEach(closeClientConnection);
        }
        else {
            closeClientConnection(this.options);
        }
    }
};
exports.RedisCoreModule = RedisCoreModule = RedisCoreModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [redis_service_1.RedisService],
        exports: [redis_service_1.RedisService],
    }),
    __param(0, (0, common_1.Inject)(redis_constants_1.REDIS_MODULE_OPTIONS)),
    __param(1, (0, common_1.Inject)(redis_constants_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [Object, Object])
], RedisCoreModule);
