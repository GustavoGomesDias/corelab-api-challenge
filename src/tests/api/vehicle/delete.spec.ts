import { connect } from '@db/db';
import VehicleRepository from '@repo/VehicleRepository';
import { Server } from 'http';
import request from 'supertest';
import app from '../../../app';

describe('Handle delete API route', () => {
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

  test('Should return 400 if id is undefined', async () => {
    jest.spyOn(VehicleRepository.prototype, 'delete').mockImplementationOnce(jest.fn());
    const response = await supertest.delete('/vehicle/""')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toEqual(400);
  });

  test('Should call delete route with corret id', async () => {
    const spy = jest.spyOn(VehicleRepository.prototype, 'delete').mockImplementationOnce(jest.fn());
    await supertest.delete('/vehicle/aaaa')
      .expect('Content-Type', /json/);

    expect(spy).toHaveBeenCalledWith('aaaa');
  });

  test('Should return 200 if vehicle is deleted', async () => {
    jest.spyOn(VehicleRepository.prototype, 'delete').mockImplementationOnce(jest.fn());
    const response = await supertest.delete('/vehicle/aaaa')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toEqual(200);
  });
});
