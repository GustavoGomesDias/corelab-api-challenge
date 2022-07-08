import { connect } from '@db/db';
import VehicleRepository from '@repo/VehicleRepository';
import { Server } from 'http';
import request from 'supertest';
import app from '../../../app';

describe('Handle get all API route', () => {
  let server: Server;
  let supertest: request.SuperAgentTest;
  beforeAll(async () => {
    const { cachedDb } = await connect();
    server = app.listen(4001);

    supertest = request.agent(server);
  });

  afterAll(async () => {
    const { cachedClient } = await connect();
    cachedClient?.close();
    if (server) {
      server.close();
    }
  });
  jest.spyOn(console, 'log').mockImplementation(jest.fn());

  test('Should return an empty array if no exists vehicle in database', async () => {
    jest.spyOn(VehicleRepository.prototype, 'getAll').mockImplementationOnce(async () => {
      const result = await Promise.resolve([]);

      return result;
    });
    const response = await supertest.get('/vehicle/')
      .expect('Content-Type', /json/);

    expect(response.body.content).toEqual([]);
  });
});
