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
const core_1 = require("@nestjs/core");
const redis_client_provider_1 = require("./redis-client.provider");
const redis_constants_1 = require("./redis.constants");
const redis_service_1 = require("./redis.service");
let RedisCoreModule = RedisCoreModule_1 = class RedisCoreModule {
    constructor(options, moduleRef) {
        this.options = options;
        this.moduleRef = moduleRef;
    }
    static register(options) {
        return {
            module: RedisCoreModule_1,
            providers: [
                redis_client_provider_1.createClient(),
                { provide: redis_constants_1.REDIS_MODULE_OPTIONS, useValue: options },
            ],
            exports: [redis_service_1.RedisService],
        };
    }
    static forRootAsync(options) {
        return {
            module: RedisCoreModule_1,
            imports: options.imports,
            providers: [redis_client_provider_1.createClient(), redis_client_provider_1.createAsyncClientOptions(options)],
            exports: [redis_service_1.RedisService],
        };
    }
    onModuleDestroy() {
        const closeConnection = ({ clients, defaultKey }) => options => {
            const name = options.name || defaultKey;
            const client = clients.get(name);
            if (client && !options.keepAlive) {
                client.disconnect();
            }
        };
        const redisClient = this.moduleRef.get(redis_constants_1.REDIS_CLIENT);
        const closeClientConnection = closeConnection(redisClient);
        if (Array.isArray(this.options)) {
            this.options.forEach(closeClientConnection);
        }
        else {
            closeClientConnection(this.options);
        }
    }
};
RedisCoreModule = RedisCoreModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({
        providers: [redis_service_1.RedisService],
        exports: [redis_service_1.RedisService],
    }),
    __param(0, common_1.Inject(redis_constants_1.REDIS_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object, core_1.ModuleRef])
], RedisCoreModule);
exports.RedisCoreModule = RedisCoreModule;
