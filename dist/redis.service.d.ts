import type { Redis } from 'ioredis';
import { RedisClient } from './redis.provider';
export declare class RedisService {
    private readonly redisClient;
    constructor(redisClient: RedisClient);
    getClient(clientName?: string): Redis;
    getClients(): Map<string, Redis>;
}
