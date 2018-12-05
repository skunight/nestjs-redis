import * as Redis from "ioredis";
import { RedisModuleOptions } from "./redis.interface";
export declare const createClient: () => {
    provide: symbol;
    useFactory: (options: RedisModuleOptions) => Redis.Redis;
    inject: symbol[];
};
