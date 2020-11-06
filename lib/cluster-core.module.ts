import {
  DynamicModule,
  Global,
  Module,
  Inject,
  OnModuleDestroy,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Cluster } from 'ioredis';
import {
  RedisClusterModuleAsyncOptions,
  RedisClusterModuleOptions,
} from './cluster.interface';
import {
  createAsyncClusterOptions,
  createCluster,
  RedisClusterProvider,
} from './cluster.provider';

import {
  REDIS_CLUSTER_MODULE_OPTIONS,
  REDIS_CLUSTER,
} from './cluster.constants';
import { RedisClusterService } from './cluster.service';

@Global()
@Module({
  providers: [RedisClusterService],
  exports: [RedisClusterService],
})
export class ClusterCoreModule implements OnModuleDestroy {
  constructor(
    @Inject(REDIS_CLUSTER_MODULE_OPTIONS)
    private readonly options:
      | RedisClusterModuleOptions
      | RedisClusterModuleOptions[],
    private readonly moduleRef: ModuleRef,
  ) {}

  static register(
    options: RedisClusterModuleOptions | RedisClusterModuleOptions[],
  ): DynamicModule {
    return {
      module: ClusterCoreModule,
      providers: [
        createCluster(),
        { provide: REDIS_CLUSTER_MODULE_OPTIONS, useValue: options },
      ],
      exports: [RedisClusterService],
    };
  }

  static forRootAsync(options: RedisClusterModuleAsyncOptions): DynamicModule {
    return {
      module: ClusterCoreModule,
      imports: options.imports,
      providers: [createCluster(), createAsyncClusterOptions(options)],
      exports: [RedisClusterService],
    };
  }

  onModuleDestroy() {
    const closeConnection = ({
      clusters,
      defaultKey,
    }: RedisClusterProvider) => options => {
      const name = options.name || defaultKey;
      const cluster: Cluster = clusters.get(name);

      if (cluster && !options.keepAlive) {
        cluster.disconnect();
      }
    };

    const provider = this.moduleRef.get<RedisClusterProvider>(REDIS_CLUSTER);
    const closeClusterConnection = closeConnection(provider);

    if (Array.isArray(this.options)) {
      this.options.forEach(closeClusterConnection);
    } else {
      closeClusterConnection(this.options);
    }
  }
}
