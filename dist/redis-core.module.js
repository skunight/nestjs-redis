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
import { Global, Module, Inject, } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { createAsyncClientOptions, createClient, } from './redis-client.provider';
import { REDIS_MODULE_OPTIONS, REDIS_CLIENT } from './redis.constants';
import { RedisService } from './redis.service';
let RedisCoreModule = RedisCoreModule_1 = class RedisCoreModule {
    constructor(options, moduleRef) {
        this.options = options;
        this.moduleRef = moduleRef;
    }
    static register(options) {
        return {
            module: RedisCoreModule_1,
            providers: [
                createClient(),
                { provide: REDIS_MODULE_OPTIONS, useValue: options },
            ],
            exports: [RedisService],
        };
    }
    static forRootAsync(options) {
        return {
            module: RedisCoreModule_1,
            imports: options.imports,
            providers: [createClient(), createAsyncClientOptions(options)],
            exports: [RedisService],
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
        const redisClient = this.moduleRef.get(REDIS_CLIENT);
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
    Global(),
    Module({
        providers: [RedisService],
        exports: [RedisService],
    }),
    __param(0, Inject(REDIS_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object, ModuleRef])
], RedisCoreModule);
export { RedisCoreModule };
