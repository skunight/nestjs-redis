import { Test, TestingModule } from '@nestjs/testing';
import { RedisCoreModule } from '../redis-core.module';
import { RedisModuleOptions } from '../redis.interface';
import { REDIS_MODULE_OPTIONS, REDIS_CLIENT } from '../redis.constants';
import { RedisService } from '../redis.service';

describe('RedisCoreModule', () => {
  let testingModule: TestingModule;
  const mockOptions: RedisModuleOptions = {
    host: 'localhost',
    port: 6379,
  };

  const mockRedisClient = {
    clients: new Map(),
    defaultKey: 'default',
    size: 0,
  };

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        RedisCoreModule,
        {
          provide: REDIS_MODULE_OPTIONS,
          useValue: mockOptions,
        },
        {
          provide: REDIS_CLIENT,
          useValue: mockRedisClient,
        },
        RedisService,
      ],
    }).compile();
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('register', () => {
    it('should register module with options', () => {
      const dynamicModule = RedisCoreModule.register(mockOptions);
      expect(dynamicModule).toBeDefined();
      expect(dynamicModule.module).toBe(RedisCoreModule);
      expect(dynamicModule.providers).toBeDefined();
      expect(dynamicModule.exports).toContain(RedisService);
    });

    it('should register module with array of options', () => {
      const optionsArray: RedisModuleOptions[] = [
        mockOptions,
        { ...mockOptions, name: 'second' },
      ];
      const dynamicModule = RedisCoreModule.register(optionsArray);
      expect(dynamicModule).toBeDefined();
      expect(dynamicModule.module).toBe(RedisCoreModule);
    });
  });

  describe('forRootAsync', () => {
    it('should register module with async options', () => {
      const asyncOptions = {
        useFactory: () => mockOptions,
      };
      const dynamicModule = RedisCoreModule.forRootAsync(asyncOptions);
      expect(dynamicModule).toBeDefined();
      expect(dynamicModule.module).toBe(RedisCoreModule);
      expect(dynamicModule.providers).toBeDefined();
      expect(dynamicModule.exports).toContain(RedisService);
    });
  });

  describe('onModuleDestroy', () => {
    it('should close connections when module is destroyed', async () => {
      const mockDisconnect = jest.fn();

      mockRedisClient.clients.set('default', { disconnect: mockDisconnect });

      await testingModule.close();

      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should not close connections when keepAlive is true', async () => {
      const mockDisconnect = jest.fn();

      mockRedisClient.clients.set('default', { disconnect: mockDisconnect });

      // Create a new module with keepAlive option
      const keepAliveModule = await Test.createTestingModule({
        providers: [
          RedisCoreModule,
          {
            provide: REDIS_MODULE_OPTIONS,
            useValue: { ...mockOptions, keepAlive: true },
          },
          {
            provide: REDIS_CLIENT,
            useValue: mockRedisClient,
          },
          RedisService,
        ],
      }).compile();

      await keepAliveModule.close();

      expect(mockDisconnect).not.toHaveBeenCalled();
    });
  });
});
