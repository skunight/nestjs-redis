import { Injectable, Inject } from "@nestjs/common";
import { REDIS_CLIENT } from './redis.constants';
import * as Redis from "ioredis";

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly client: Redis.Redis
  ) {}

  getClient() : Redis.Redis {
    return this.client
  }
}