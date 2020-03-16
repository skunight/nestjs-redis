import * as Redis from 'ioredis';
import { RedisClient } from './redis-client.provider';
export declare class RedisService {
    private readonly redisClient;
    constructor(redisClient: RedisClient);
    getClient(name?: string): Redis.Redis;
    getClients(): Map<string, Redis.Redis>;
}
