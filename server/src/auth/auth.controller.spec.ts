import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string): string => {
              const config: Record<string, string> = {
                CLIENT_HOMEPAGE_URL: 'http://localhost:5173',
                SESSION_SECRET: 'test-secret',
              };
              return config[key] || '';
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
