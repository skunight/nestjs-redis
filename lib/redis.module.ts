import { DynamicModule, Module } from '@nestjs/common';
import { RedisCoreModule } from './redis-core.module';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';


@Module({})
export class RedisModule {
  static register(
    options: RedisModuleOptions | RedisModuleOptions[],
  ): DynamicModule {

    const registeredModule =  RedisCoreModule.register(options)
    return {
      module: RedisModule,
      imports: [registeredModule],
      exports: [registeredModule],
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    const registeredModule = RedisCoreModule.forRootAsync(options);
    return {
      module: RedisModule,
      imports: [registeredModule],
      exports: [registeredModule],
    };
  }
}
