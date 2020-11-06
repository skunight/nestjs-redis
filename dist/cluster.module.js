"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RedisClusterModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClusterModule = void 0;
const common_1 = require("@nestjs/common");
const cluster_core_module_1 = require("./cluster-core.module");
let RedisClusterModule = RedisClusterModule_1 = class RedisClusterModule {
    static register(options) {
        return {
            module: RedisClusterModule_1,
            imports: [cluster_core_module_1.ClusterCoreModule.register(options)],
        };
    }
    static forRootAsync(options) {
        return {
            module: RedisClusterModule_1,
            imports: [cluster_core_module_1.ClusterCoreModule.forRootAsync(options)],
        };
    }
};
RedisClusterModule = RedisClusterModule_1 = __decorate([
    common_1.Module({})
], RedisClusterModule);
exports.RedisClusterModule = RedisClusterModule;
//# sourceMappingURL=cluster.module.js.map