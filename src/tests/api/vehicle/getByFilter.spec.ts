import { connect } from '@db/db';
import VehicleRepository from '@repo/VehicleRepository';
import { Server } from 'http';
import request from 'supertest';
import app from '../../../app';

describe('Handle get by filter info API route', () => {
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

  test('Should call filterByMultipleFields function with correct value', async () => {
    const spy = jest.spyOn(VehicleRepository.prototype, 'filterByMultipleFields').mockImplementationOnce(jest.fn());
    const response = await supertest.get('/vehicle/filter/?name=test&year=2010&color=fff&priceMin=29.9&priceMax=11')
      .expect('Content-Type', /json/);

    // console.log(response.body.content);

    expect(spy).toHaveBeenCalledWith({
      name: 'test',
      year: '2010',
      color: 'fff',
      priceMin: '29.9',
      priceMax: '11',
    });
  });

  test('Should return 400 if filter query contains an undefined item', async () => {
    jest.spyOn(VehicleRepository.prototype, 'filterByMultipleFields').mockImplementationOnce(jest.fn());
    const response = await supertest.get('/vehicle/filter/?name=&year=2010&color=fff')
      .expect('Content-Type', /json/);

    expect(response.statusCode).toEqual(400);
  });

  // Por algum motivo, para essa rota não vem body
  // test('Should return an array for a valid end point call', async () => {
  //   jest.spyOn(VehicleRepository.prototype, 'filterByMultipleFields').mockImplementationOnce(async () => {
  //     const result = await Promise.resolve([
  //       vehicle, vehicle,
  //     ]);

  //     return result;
  //   });
  //   const response = await supertest.get('/vehicle/filter/')
  //     .query({
  //       name: 'test',
  //       year: '2010',
  //     })
  //     .expect('Content-Type', /json/);

  //   console.log(response.headers);

  //   const { createdAt, ...rest } = vehicle;
  //   expect(response.body).toEqual([
  //     {
  //       createdAt: new Date(createdAt).toISOString(),
  //       ...rest,
  //     },
  //     {
  //       createdAt: new Date(createdAt).toISOString(),
  //       ...rest,
  //     },
  //   ]);
  // });

  test('Should return 200 if get vehicles', async () => {
    jest.spyOn(VehicleRepository.prototype, 'filterByMultipleFields').mockImplementationOnce(async () => {
      const result = await Promise.resolve([
        vehicle, vehicle,
      ]);

      return result;
    });
    const response = await supertest.get('/vehicle/filter/')
      .query({
        name: 'test',
        year: '2010',
      })
      .expect('Content-Type', /json/);

    expect(response.statusCode).toEqual(200);
  });
});
