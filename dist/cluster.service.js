"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClusterService = void 0;
const common_1 = require("@nestjs/common");
const cluster_constants_1 = require("./cluster.constants");
const cluster_provider_1 = require("./cluster.provider");
let RedisClusterService = class RedisClusterService {
    constructor(provider) {
        this.provider = provider;
    }
    getCluster(name) {
        if (!name) {
            name = this.provider.defaultKey;
        }
        if (!this.provider.clusters.has(name)) {
            throw new cluster_provider_1.RedisClusterError(`cluster ${name} does not exist`);
        }
        return this.provider.clusters.get(name);
    }
    getClusters() {
        return this.provider.clusters;
    }
};
RedisClusterService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(cluster_constants_1.REDIS_CLUSTER)),
    __metadata("design:paramtypes", [Object])
], RedisClusterService);
exports.RedisClusterService = RedisClusterService;
//# sourceMappingURL=cluster.service.js.map