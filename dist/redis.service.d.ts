import * as Redis from "ioredis";
export declare class RedisService {
    private readonly client;
    constructor(client: Redis.Redis);
    getClient(): Redis.Redis;
}
