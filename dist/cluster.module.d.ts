import { DynamicModule } from '@nestjs/common';
import { ClusterModuleAsyncOptions, ClusterModuleOptions } from './cluster.interface';
export declare class ClusterModule {
    static register(options: ClusterModuleOptions | ClusterModuleOptions[]): DynamicModule;
    static forRootAsync(options: ClusterModuleAsyncOptions): DynamicModule;
}
