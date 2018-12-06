"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var RedisModule_1;
const common_1 = require("@nestjs/common");
const redis_constants_1 = require("./redis.constants");
const redis_service_1 = require("./redis.service");
const redis_client_provider_1 = require("./redis-client.provider");
let RedisModule = RedisModule_1 = class RedisModule {
    static register(options) {
        return {
            module: RedisModule_1,
            providers: [
                redis_client_provider_1.createClient(),
                { provide: redis_constants_1.REDIS_MODULE_OPTIONS, useValue: options }
            ],
            exports: [redis_service_1.RedisService]
        };
    }
    static forRootAsync(options) {
        return {
            module: RedisModule_1,
            imports: options.imports,
            providers: [
                redis_client_provider_1.createClient(),
                redis_client_provider_1.createAsyncClientOptions(options),
            ],
            exports: [redis_service_1.RedisService]
        };
    }
};
RedisModule = RedisModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({
        providers: [redis_service_1.RedisService],
        exports: [redis_service_1.RedisService]
    })
], RedisModule);
exports.RedisModule = RedisModule;
