import { DynamicModule, Module } from '@nestjs/common';
import {
  ClusterModuleAsyncOptions,
  ClusterModuleOptions,
} from './cluster.interface';

import { ClusterCoreModule } from './cluster-core.module';

@Module({})
export class ClusterModule {
  static register(
    options: ClusterModuleOptions | ClusterModuleOptions[],
  ): DynamicModule {
    return {
      module: ClusterModule,
      imports: [ClusterCoreModule.register(options)],
    };
  }

  static forRootAsync(options: ClusterModuleAsyncOptions): DynamicModule {
    return {
      module: ClusterModule,
      imports: [ClusterCoreModule.forRootAsync(options)],
    };
  }
}
