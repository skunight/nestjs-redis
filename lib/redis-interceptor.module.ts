import {Module, OnModuleInit, DynamicModule} from '@nestjs/common';
import {RedisModule} from './redis.module';
import {RedisInterceptor, RedisInterceptorConfig} from './redis-interceptor';
import { REDIS_INTERCEPTOR_CONFIG } from './redis.constants';

@Module({
  imports: [RedisModule],
  providers: [RedisInterceptor],
})
export class RedisInterceptorModule implements OnModuleInit {
  constructor (private readonly redisInterceptor: RedisInterceptor) {}

  async onModuleInit(): Promise<void> {
    await this.redisInterceptor.root();
  }

  public static forRoot(options: RedisInterceptorConfig): DynamicModule {
    return {
      module: RedisInterceptorModule,
      providers: [
        RedisInterceptor, 
        {
          provide: REDIS_INTERCEPTOR_CONFIG,
          useValue: options,
        }
      ],
    };
  }

  public static forRootAsync(options: {inject: any[]; useFactory: (...args: any[]) => RedisInterceptorConfig;}): DynamicModule {
    return {
      module: RedisInterceptor,
      providers: [
        RedisInterceptor,
        {
          provide: REDIS_INTERCEPTOR_CONFIG,
          inject: options.inject,
          useFactory: options.useFactory,
        },
      ],
    };
  }
}
