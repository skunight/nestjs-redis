import { Injectable, Inject } from '@nestjs/common';
import { REDIS_CLIENTS } from './redis.constants';
import { RedisClient, RedisClientError, RedisClients } from './redis-client.provider';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENTS) private readonly redisClients: RedisClients,
  ) {}

  getClient(name?: string): RedisClient {
    if (!name) {
      name = this.redisClients.defaultKey;
    }
    if (!this.redisClients.clients.has(name)) {
      throw new RedisClientError(`client ${name} does not exist`);
    }
    return this.redisClients.clients.get(name);
  }

  getClients(): Map<string, RedisClient> {
    return this.redisClients.clients;
  }
}
