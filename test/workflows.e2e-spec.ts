import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Workflow API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/workflows (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/workflows')
      .send({ name: 'Test Workflow', definition: {}, nodes: [] });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Test Workflow');
  });

  afterAll(async () => {
    await app.close();
  });
});
