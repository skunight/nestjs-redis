import { DynamicModule, Module } from '@nestjs/common';
import { RedisModuleOptions } from './redis.interface';
import { REDIS_MODULE_OPTIONS } from './redis.constants';
import { RedisService } from './redis.service';

@Module({
  providers:[RedisService],
  exports:[RedisService]
})
export class RedisModule {
  static register(options:RedisModuleOptions): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        { provide: REDIS_MODULE_OPTIONS,useValue:options}
      ],
      exports: [RedisService]
    }
  }
}