import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { strictValidationPipe } from '../src/common/strict-validation.pipe';
import { authRequest, login } from './e2e-test-utils';

describe('Security E2E', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.setGlobalPrefix('api');
    app.useGlobalPipes(strictValidationPipe);

    await app.init();

    token = await login(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects protected route without JWT', async () => {
    await request(app.getHttpServer()).get('/api/dashboard').expect(401);
  });

  it('rejects unknown DTO fields because strict validation is enabled', async () => {
    await authRequest(app, token)
      .post('/api/items')
      .send({
        title: `Bad DTO ${Date.now()}`,
        kind: 'set',
        unknownField: 'must fail',
      })
      .expect(400);
  });

  it('sets security headers', async () => {
    const response = await request(app.getHttpServer()).get('/api/health');

    expect(response.headers['x-content-type-options']).toEqual('nosniff');
    expect(response.headers['x-frame-options']).toEqual('DENY');
    expect(response.headers['referrer-policy']).toEqual('no-referrer');
  });
});