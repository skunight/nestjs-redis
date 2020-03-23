import { Injectable, Inject } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constants';
import * as Redis from 'ioredis';
import { RedisClient, RedisClientError } from './redis-client.provider';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient,
  ) {}

  getClient(name?: string): Redis.Redis {
    if (!name) {
      name = this.redisClient.defaultKey;
    }
    if (!this.redisClient.clients.has(name)) {
      throw new RedisClientError(`client ${name} does not exist`);
    }
    return this.redisClient.clients.get(name);
  }

  getClients(): Map<string, Redis.Redis> {
    return this.redisClient.clients;
  }
}
