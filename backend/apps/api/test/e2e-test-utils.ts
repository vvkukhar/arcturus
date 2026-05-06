import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export type E2EContext = {
  app: INestApplication;
  token: string;
};

export async function login(app: INestApplication): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({
      token: process.env.ADMIN_BOOTSTRAP_TOKEN ?? 'supersecret',
    })
    .expect((res) => {
      if (![200, 201].includes(res.status)) {
        throw new Error(`Login failed: ${res.status} ${JSON.stringify(res.body)}`);
      }
    });

  return response.body.token;
}

export function authRequest(app: INestApplication, token: string) {
  return request(app.getHttpServer()).set('Authorization', `Bearer ${token}`);
}

export function uniqueSetNumber(): string {
  return String(Math.floor(100000 + Math.random() * 899999));
}