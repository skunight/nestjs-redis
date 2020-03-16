
# Nestjs Redis

Redis component for NestJs.


### Installation

**Yarn**
```bash
yarn add nestjs-redis
```

**NPM**
```bash
npm install nestjs-redis --save
```

### Getting Started
Let's register the RedisModule in `app.module.ts`

```typescript
import { Module } from '@nestjs/common'
import { RedisModule} from 'nestjs-redis'

@Module({
    imports: [
        RedisModule.register(options)
    ],
})
export class AppModule {}
```
With Async
```typescript
import { Module } from '@nestjs/common';
import { RedisModule} from 'nestjs-redis'

@Module({
    imports: [
        RedisModule.forRootAsync({
            useFactory: (configService: ConfigService) => configService.get('redis'),         // or use async method
            //useFactory: async (configService: ConfigService) => configService.get('redis'),
            inject:[ConfigService]
        }),
    ],
})
export class AppModule {}
```
And the config file look like this
With single client
```typescript
export default {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    db: parseInt(process.env.REDIS_DB),
    password: process.env.REDIS_PASSWORD,
    keyPrefix: process.env.REDIS_PRIFIX,
}
Or
export default {
    url: 'redis://:authpassword@127.0.0.1:6380/4',
}
```
With custom error handler
```typescript
export default {
    url: 'redis://:authpassword@127.0.0.1:6380/4',
    onClientReady: (client) => {
      client.on('error', (err) => {}
    )},
}
```
With multi client
```typescript
export default [
    {
        name:'test1',
        url: 'redis://:authpassword@127.0.0.1:6380/4',
    },
    {
        name:'test2',
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        db: parseInt(process.env.REDIS_DB),
        password: process.env.REDIS_PASSWORD,
        keyPrefix: process.env.REDIS_PRIFIX,
    },
]
```
And use in your service
```typescript
import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class TestService {
  constructor(
    private readonly redisService: RedisService,
  ) { }
  async root(): Promise<boolean> {
    const client = await this.redisService.getClient('test')
    return true
  }
}
```
Options
```typescript
interface RedisOptions {
    /**
     * client name. default is a uuid, unique.
     */
    name?: string;
    url?: string;
    port?: number;
    host?: string;
    /**
     * 4 (IPv4) or 6 (IPv6), Defaults to 4.
     */
    family?: number;
    /**
     * Local domain socket path. If set the port, host and family will be ignored.
     */
    path?: string;
    /**
     * TCP KeepAlive on the socket with a X ms delay before start. Set to a non-number value to disable keepAlive.
     */
    keepAlive?: number;
    connectionName?: string;
    /**
     * If set, client will send AUTH command with the value of this option when connected.
     */
    password?: string;
    /**
     * Database index to use.
     */
    db?: number;
    /**
     * When a connection is established to the Redis server, the server might still be loading
     * the database from disk. While loading, the server not respond to any commands.
     * To work around this, when this option is true, ioredis will check the status of the Redis server,
     * and when the Redis server is able to process commands, a ready event will be emitted.
     */
    enableReadyCheck?: boolean;
    keyPrefix?: string;
    /**
     * When the return value isn't a number, ioredis will stop trying to reconnect.
     * Fixed in: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/15858
     */
    retryStrategy?(times: number): number | false;
    /**
     * By default, all pending commands will be flushed with an error every
     * 20 retry attempts. That makes sure commands won't wait forever when
     * the connection is down. You can change this behavior by setting
     * `maxRetriesPerRequest`.
     *
     * Set maxRetriesPerRequest to `null` to disable this behavior, and
     * every command will wait forever until the connection is alive again
     * (which is the default behavior before ioredis v4).
     */
    maxRetriesPerRequest?: number | null;
    /**
     * 1/true means reconnect, 2 means reconnect and resend failed command. Returning false will ignore
     * the error and do nothing.
     */
    reconnectOnError?(error: Error): boolean | 1 | 2;
    /**
     * By default, if there is no active connection to the Redis server, commands are added to a queue
     * and are executed once the connection is "ready" (when enableReadyCheck is true, "ready" means
     * the Redis server has loaded the database from disk, otherwise means the connection to the Redis
     * server has been established). If this option is false, when execute the command when the connection
     * isn't ready, an error will be returned.
     */
    enableOfflineQueue?: boolean;
    /**
     * The milliseconds before a timeout occurs during the initial connection to the Redis server.
     * default: 10000.
     */
    connectTimeout?: number;
    /**
     * After reconnected, if the previous connection was in the subscriber mode, client will auto re-subscribe these channels.
     * default: true.
     */
    autoResubscribe?: boolean;
    /**
     * If true, client will resend unfulfilled commands(e.g. block commands) in the previous connection when reconnected.
     * default: true.
     */
    autoResendUnfulfilledCommands?: boolean;
    lazyConnect?: boolean;
    tls?: tls.ConnectionOptions;
    sentinels?: Array<{ host: string; port: number; }>;
    name?: string;
    /**
     * Enable READONLY mode for the connection. Only available for cluster mode.
     * default: false.
     */
    readOnly?: boolean;
    /**
     * If you are using the hiredis parser, it's highly recommended to enable this option.
     * Create another instance with dropBufferSupport disabled for other commands that you want to return binary instead of string
     */
    dropBufferSupport?: boolean;
    /**
     * Whether to show a friendly error stack. Will decrease the performance significantly.
     */
    showFriendlyErrorStack?: boolean;
}
```
That's it!
