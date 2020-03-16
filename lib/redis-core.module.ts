import {
  DynamicModule,
  Global,
  Module,
  Inject,
  OnModuleDestroy,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';
import {
  createAsyncClientOptions,
  createClient,
  RedisClient,
} from './redis-client.provider';

import { REDIS_MODULE_OPTIONS, REDIS_CLIENT } from './redis.constants';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisCoreModule implements OnModuleDestroy {
  constructor(
    @Inject(REDIS_MODULE_OPTIONS)
    private readonly options: RedisModuleOptions | RedisModuleOptions[],
    private readonly moduleRef: ModuleRef,
  ) {}

  static register(
    options: RedisModuleOptions | RedisModuleOptions[],
  ): DynamicModule {
    return {
      module: RedisCoreModule,
      providers: [
        createClient(),
        { provide: REDIS_MODULE_OPTIONS, useValue: options },
      ],
      exports: [RedisService],
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisCoreModule,
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

    const redisClient = this.moduleRef.get<RedisClient>(REDIS_CLIENT);
    const closeClientConnection = closeConnection(redisClient);

    if (Array.isArray(this.options)) {
      this.options.forEach(closeClientConnection);
    } else {
      closeClientConnection(this.options);
    }
  }
}
