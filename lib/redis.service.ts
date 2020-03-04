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
      throw new RedisClientError(`client ${name} is not exists`);
    }
    return this.redisClient.clients.get(name);
  }

  getClients(): Map<string, Redis.Redis> {
    return this.redisClient.clients;
  }

  // Prevents possible hanging after running tests (like with Jest).
  // See https://github.com/kyknow/nestjs-redis/issues/37
  onModuleDestroy() {
    this.getClients().forEach((client: Redis.Redis) => {
      client.disconnect();
    })
  }
}
