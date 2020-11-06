import { DynamicModule, Module } from '@nestjs/common';

import type {
  RedisClusterModuleAsyncOptions,
  RedisClusterModuleOptions,
} from './cluster.interface';
import { ClusterCoreModule } from './cluster-core.module';

@Module({})
export class RedisClusterModule {
  static register(
    options: RedisClusterModuleOptions | RedisClusterModuleOptions[],
  ): DynamicModule {
    return {
      module: RedisClusterModule,
      imports: [ClusterCoreModule.register(options)],
    };
  }

  static forRootAsync(options: RedisClusterModuleAsyncOptions): DynamicModule {
    return {
      module: RedisClusterModule,
      imports: [ClusterCoreModule.forRootAsync(options)],
    };
  }
}
