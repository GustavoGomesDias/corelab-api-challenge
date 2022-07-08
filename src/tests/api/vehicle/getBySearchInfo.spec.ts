import { connect } from '@db/db';
import VehicleRepository from '@repo/VehicleRepository';
import { Server } from 'http';
import request from 'supertest';
import app from '../../../app';

describe('Handle get by search info API route', () => {
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
  const universalDate = new Date();

  const vehicle = {
    _id: 'uhsidhauid',
    isFavorite: true,
    createdAt: universalDate,
    name: 'Toyota XYZ',
    plate: 'ABC1234',
    description: 'Your car of the year',
    year: 2022,
    color: 'red',
    price: 2099.99,
  };

  test('Should call findInAnyFieldWithSearchInfo function with correct value', async () => {
    const spy = jest.spyOn(VehicleRepository.prototype, 'findInAnyFieldWithSearchInfo').mockImplementationOnce(jest.fn());
    await supertest.get('/vehicle/search/test')
      .expect('Content-Type', /json/);

    expect(spy).toHaveBeenCalledWith('test');
  });

  test('Should return 400 if search param is undefined', async () => {
    jest.spyOn(VehicleRepository.prototype, 'findInAnyFieldWithSearchInfo').mockImplementationOnce(jest.fn());
    const response = await supertest.get('/vehicle/search/""')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toEqual(400);
  });

  test('Should return 200 if search returns a vehicles', async () => {
    jest.spyOn(VehicleRepository.prototype, 'findInAnyFieldWithSearchInfo').mockImplementationOnce(async () => {
      const result = await Promise.resolve([
        vehicle, vehicle,
      ]);

      return result;
    });
    const response = await supertest.get('/vehicle/search/test')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toEqual(200);
  });

  test('Should return an array for a valid end point call', async () => {
    jest.spyOn(VehicleRepository.prototype, 'findInAnyFieldWithSearchInfo').mockImplementationOnce(async () => {
      const result = await Promise.resolve([
        vehicle, vehicle,
      ]);

      return result;
    });
    const response = await supertest.get('/vehicle/search/test')
      .expect('Content-Type', /json/);

    const { createdAt, ...rest } = vehicle;
    expect(response.body.content).toEqual([
      {
        createdAt: new Date(createdAt).toISOString(),
        ...rest,
      },
      {
        createdAt: new Date(createdAt).toISOString(),
        ...rest,
      },
    ]);
  });
});
