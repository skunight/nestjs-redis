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
import { Injectable, Inject } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constants';
import { RedisClientError } from './redis-client.provider';
let RedisService = class RedisService {
    constructor(redisClient) {
        this.redisClient = redisClient;
    }
    getClient(name) {
        if (!name) {
            name = this.redisClient.defaultKey;
        }
        if (!this.redisClient.clients.has(name)) {
            throw new RedisClientError(`client ${name} does not exist`);
        }
        return this.redisClient.clients.get(name);
    }
    getClients() {
        return this.redisClient.clients;
    }
};
RedisService = __decorate([
    Injectable(),
    __param(0, Inject(REDIS_CLIENT)),
    __metadata("design:paramtypes", [Object])
], RedisService);
export { RedisService };
