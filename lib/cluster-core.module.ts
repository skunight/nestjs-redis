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
  ClusterModuleAsyncOptions,
  ClusterModuleOptions,
} from './cluster.interface';
import {
  createAsyncClusterOptions,
  createCluster,
  ClusterProvider,
} from './cluster.provider';

import { CLUSTER_MODULE_OPTIONS, REDIS_CLUSTER } from './cluster.constants';
import { ClusterService } from './cluster.service';

@Global()
@Module({
  providers: [ClusterService],
  exports: [ClusterService],
})
export class ClusterCoreModule implements OnModuleDestroy {
  constructor(
    @Inject(CLUSTER_MODULE_OPTIONS)
    private readonly options: ClusterModuleOptions | ClusterModuleOptions[],
    private readonly moduleRef: ModuleRef,
  ) {}

  static register(
    options: ClusterModuleOptions | ClusterModuleOptions[],
  ): DynamicModule {
    return {
      module: ClusterCoreModule,
      providers: [
        createCluster(),
        { provide: CLUSTER_MODULE_OPTIONS, useValue: options },
      ],
      exports: [ClusterService],
    };
  }

  static forRootAsync(options: ClusterModuleAsyncOptions): DynamicModule {
    return {
      module: ClusterCoreModule,
      imports: options.imports,
      providers: [createCluster(), createAsyncClusterOptions(options)],
      exports: [ClusterService],
    };
  }

  onModuleDestroy() {
    const closeConnection = ({
      clusters,
      defaultKey,
    }: ClusterProvider) => options => {
      const name = options.name || defaultKey;
      const cluster: Cluster = clusters.get(name);

      if (cluster && !options.keepAlive) {
        cluster.disconnect();
      }
    };

    const provider = this.moduleRef.get<ClusterProvider>(REDIS_CLUSTER);
    const closeClusterConnection = closeConnection(provider);

    if (Array.isArray(this.options)) {
      this.options.forEach(closeClusterConnection);
    } else {
      closeClusterConnection(this.options);
    }
  }
}
