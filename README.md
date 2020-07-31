# Nestjs Redis

Redis component for NestJs with cluster support.

### Installation

**Yarn**

```bash
yarn add nestjs-redis-cluster
```

**NPM**

```bash
npm install nestjs-redis-cluster --save
```

### Getting Started

##### RedisModule

Let's register the ClusterModule and RedisModule in `app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis-cluster';

@Module({
  imports: [RedisModule.register(options)],
})
export class AppModule {}
```

With Async

```typescript
import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis-redis';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get('redis'),
      // or use async method
      //useFactory: async (configService: ConfigService) => configService.get('redis'),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

Config looks like this for RedisModule with single client

```typescript
export default {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  db: parseInt(process.env.REDIS_DB),
  password: process.env.REDIS_PASSWORD,
  keyPrefix: process.env.REDIS_PRIFIX,
};
Or;
export default {
  url: 'redis://:authpassword@127.0.0.1:6380/4',
};
```

With custom error handler

```typescript
export default {
  url: 'redis://:authpassword@127.0.0.1:6380/4',
  onClientReady: client => {
    client.on('error', err => {});
  },
};
```

With multi client

```typescript
export default [
  {
    name: 'test1',
    url: 'redis://:authpassword@127.0.0.1:6380/4',
  },
  {
    name: 'test2',
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    db: parseInt(process.env.REDIS_DB),
    password: process.env.REDIS_PASSWORD,
    keyPrefix: process.env.REDIS_PRIFIX,
  },
];
```

And use in your service

```typescript
import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis-cluster';

@Injectable()
export class TestService {
  constructor(private readonly redisService: RedisService) {}
  async root(): Promise<boolean> {
    const client = await this.redisService.getClient('test');
    return true;
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
  sentinels?: Array<{ host: string; port: number }>;
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

##### ClusterModule

Let's register the RedisClusterModule in `app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { RedisClusterModule } from 'nestjs-redis-cluster';

@Module({
  imports: [RedisClusterModule.register(options)],
})
export class AppModule {}
```

With Async

```typescript
import { Module } from '@nestjs/common';
import { ClusterModule } from 'nestjs-redis-cluster';

@Module({
  imports: [
    RedisClusterModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get('cluster'),
      // or use async method
      //useFactory: async (configService: ConfigService) => configService.get('cluster'),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

Config looks like this for RedisClusterModule

```typescript
export default {
  nodes: [
    {
      host: 6380,
      port: '127.0.0.1',
    },
    {
      host: 6381,
      port: '127.0.0.1',
    },
  ],
};
Or;
export default {
  nodes: [
    {
      url: 'redis://:authpassword@127.0.0.1:6380/4',
    },
    {
      url: 'redis://:authpassword@127.0.0.1:6381/4',
    },
  ],
};
```

With custom error handler

```typescript
export default {
  nodes: [
    {
      url: 'redis://:authpassword@127.0.0.1:6380/4',
    },
  ],
  onClusterReady: cluster => {
    cluster.on('error', err => {});
  },
};
```

With multiple clusters

```typescript
export default [
  {
    name: 'test1',
    nodes: [
      {
        url: 'redis://:authpassword@127.0.0.1:6380/4',
        url: 'redis://:authpassword@127.0.0.1:6380/5',
      },
    ],
  },
  {
    name: 'test2',
    nodes: [
      {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        db: parseInt(process.env.REDIS_DB),
        password: process.env.REDIS_PASSWORD,
        keyPrefix: process.env.REDIS_PRIFIX,
      },
    ],
  },
];
```

And use in your service

```typescript
import { Injectable } from '@nestjs/common';
import { RedisClusterService } from 'nestjs-redis-cluster';

@Injectable()
export class TestService {
  constructor(private readonly redisService: RedisClusterService) {}
  async root(): Promise<boolean> {
    const client = await this.redisService.getCluster('test');
    return true;
  }
}
```

Options
Almost all the options are passed to ioredis/cluster (https://github.com/luin/ioredis/blob/master/lib/cluster/ClusterOptions.ts)

The only additional options are `name`, `nodes`, and `onClusterReady`.

```typescript
interface RedisClusterOptions {
  /**
   * client name. default is a uuid, unique.
   */
  name?: string;
  nodes: (string | number | { url: string?, host?: string, port?: number )[];

    /**
   * See "Quick Start" section.
   *
   * @default (times) => Math.min(100 + times * 2, 2000)
   */
  clusterRetryStrategy?: (
    times: number,
    reason?: Error
  ) => number | void | null;

  /**
   * See Redis class.
   *
   * @default true
   */
  enableOfflineQueue?: boolean;

  /**
   * When enabled, ioredis only emits "ready" event when `CLUSTER INFO`
   * command reporting the cluster is ready for handling commands.
   *
   * @default true
   */
  enableReadyCheck?: boolean;

  /**
   * Scale reads to the node with the specified role.
   *
   * @default "master"
   */
  scaleReads?: NodeRole | Function;

  /**
   * When a MOVED or ASK error is received, client will redirect the
   * command to another node.
   * This option limits the max redirections allowed to send a command.
   *
   * @default 16
   */
  maxRedirections?: number;

  /**
   * When an error is received when sending a command (e.g.
   * "Connection is closed." when the target Redis node is down), client will retry
   * if `retryDelayOnFailover` is valid delay time (in ms).
   *
   * @default 100
   */
  retryDelayOnFailover?: number;

  /**
   * When a CLUSTERDOWN error is received, client will retry
   * if `retryDelayOnClusterDown` is valid delay time (in ms).
   *
   * @default 100
   */
  retryDelayOnClusterDown?: number;

  /**
   * When a TRYAGAIN error is received, client will retry
   * if `retryDelayOnTryAgain` is valid delay time (in ms).
   *
   * @default 100
   */
  retryDelayOnTryAgain?: number;

  /**
   * The milliseconds before a timeout occurs while refreshing
   * slots from the cluster.
   *
   * @default 1000
   */
  slotsRefreshTimeout?: number;

  /**
   * The milliseconds between every automatic slots refresh.
   *
   * @default 5000
   */
  slotsRefreshInterval?: number;

  /**
   * Passed to the constructor of `Redis`
   *
   * @default null
   */
  redisOptions?: any;

  /**
   * By default, When a new Cluster instance is created,
   * it will connect to the Redis cluster automatically.
   * If you want to keep the instance disconnected until the first command is called,
   * set this option to `true`.
   *
   * @default false
   */
  lazyConnect?: boolean;

  /**
   * Hostnames will be resolved to IP addresses via this function.
   * This is needed when the addresses of startup nodes are hostnames instead
   * of IPs.
   *
   * You may provide a custom `lookup` function when you want to customize
   * the cache behavior of the default function.
   *
   * @default require('dns').lookup
   */
  dnsLookup?: DNSLookupFunction;
  natMap?: INatMap;
}
```

That's it!
