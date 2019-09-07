import { Test } from '@nestjs/testing';
import {RedisService} from './redis.service';
import {RedisModule} from './redis.module';
import {RedisInterceptorModule} from './redis-interceptor.module';
import * as request from 'superagent';
import { RedisInterceptor } from './redis-interceptor';
import { Controller, Get, UseInterceptors } from '@nestjs/common';

class TestRedis {
  private store: {[s: string]: {payload: string, expiryMode: string, expiry: number | string}} = {};

  public set(key: string, payload: string, expiryMode: string, expiry: number | string) {
    this.store[key] = {
      payload,
      expiryMode,
      expiry,
    };
  }

  public get(key: string) {
    return this.store[key];
  }
}

class TestRedisService extends RedisService {
  getClient(name?: string): any {
    return new TestRedis;
  }
}

@Controller('something')
class TestController {

  @UseInterceptors(RedisInterceptor)
  @Get()
  someMethod() {
    return 'Hello! Save me plz!';
  }
}

describe('RedisInterceptorModule', () => {
  let app;
  let server;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        RedisModule.register({}), 
        RedisInterceptorModule.forRoot({
          expiry: 3600,
          expiryMode: 'EX',
        }),
      ],
      controllers: [
        TestController,
      ],
    })
    .overrideProvider(RedisService)
    .useClass(TestRedisService)
    .compile();

    app = module.createNestApplication();

    await app.init();
    server = app.getHttpServer();
  });

  it('Interceptor should exists', () => {
    const interceptor = app.get(RedisInterceptor);
    expect(interceptor).toBeInstanceOf(RedisInterceptor);
  });

  it('Interceptor should store in cache', done => {
    return request(server)
      .get('/something')
      .expect(200)
      .end((_, res) => {
        const service = app.get(RedisService);
        const store = service.getClient();

        expect(store.get('GET.something')).toBe({
          payload: 'Hello! Save me plz!',
          expiry: 3600,
          expiryMode: 'EX',
        });
      });
  });
});
