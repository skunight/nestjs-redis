"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ClusterModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterModule = void 0;
const common_1 = require("@nestjs/common");
const cluster_core_module_1 = require("./cluster-core.module");
let ClusterModule = ClusterModule_1 = class ClusterModule {
    static register(options) {
        return {
            module: ClusterModule_1,
            imports: [cluster_core_module_1.ClusterCoreModule.register(options)],
        };
    }
    static forRootAsync(options) {
        return {
            module: ClusterModule_1,
            imports: [cluster_core_module_1.ClusterCoreModule.forRootAsync(options)],
        };
    }
};
ClusterModule = ClusterModule_1 = __decorate([
    common_1.Module({})
], ClusterModule);
exports.ClusterModule = ClusterModule;
