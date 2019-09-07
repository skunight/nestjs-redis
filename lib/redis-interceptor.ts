import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Redis } from 'ioredis';
import { RedisService } from './redis.service';
import { REDIS_INTERCEPTOR_CONFIG } from './redis.constants';

export interface RedisInterceptorConfig {
  expiry: number;
  expiryMode: 'EX' | 'PX' | 'NX' | 'XX';
  redisConnectionName?: string;
  logging?: boolean;
  transformers?: {
    in?: <T>(payload: T) => string;
    out?: <T>(payload: string) => T;
  };
}

@Injectable()
export class RedisInterceptor implements NestInterceptor {
  private client: Redis;

  constructor(
    private readonly redisService: RedisService, 
    @Inject(REDIS_INTERCEPTOR_CONFIG) private readonly config: RedisInterceptorConfig,
  ) {
    if (!this.config.hasOwnProperty('logging')) {
      this.config.logging = false;
    }
    const inTransformer = (payload: any): string => JSON.stringify(payload);
    const outTransformer = <Object>(payload: string): Object => JSON.parse(payload);

    if (!this.config.hasOwnProperty('transformers')) {
      this.config.transformers.in = inTransformer;
      this.config.transformers.out = outTransformer;
    } else {
      if (!this.config.transformers.hasOwnProperty('in')) {
        this.config.transformers.in = inTransformer;
      }
      if (!this.config.transformers.hasOwnProperty('out')) {
        this.config.transformers.out = outTransformer;
      }
    }
  }

  async root(): Promise<void> {
    this.client = await this.redisService.getClient(this.config.redisConnectionName);
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {

    const request = context.switchToHttp().getRequest();

    const key = `${request.method}.${request.url}`;

    const cached = await this.client.get(key);

    if (cached) {
      if (this.config.logging) {
        Logger.log('Loading cached result', 'RedisInterceptor');
      }
      return new Observable(observer => {
        observer.next(this.config.transformers.out(cached));
        observer.complete();
      });
    }

    return next.handle().pipe(
      map(response => {

        if (this.config.logging) {
          Logger.log('Caching result', 'RedisInterceptor');
        }

        this.client.set(key, this.config.transformers.in(response), this.config.expiryMode, this.config.expiry);

        return response;
      }),
    );
  }
}
