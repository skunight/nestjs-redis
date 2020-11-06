import type { Redis } from 'ioredis';
import { Injectable, Inject } from '@nestjs/common';

import { REDIS_CLIENT } from './redis.constants';
import { RedisClient, RedisClientError } from './redis.provider';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient,
  ) {}

  getClient(clientName?: string): Redis {
    if (!clientName) {
      clientName = this.redisClient.defaultKey;
    }
    if (!this.redisClient.clients.has(clientName)) {
      throw new RedisClientError(`client ${clientName} does not exist`);
    }
    return this.redisClient.clients.get(clientName);
  }

  getClients(): Map<string, Redis> {
    return this.redisClient.clients;
  }
}
