import VehicleRepository from '@repo/VehicleRepository';
import request from 'supertest';
import app from '../../../app';

describe('Handle create API route', () => {
  const supertest: request.SuperTest<request.Test> = request(app); // = request(app);
  const updateRequest = {
    id: 'sajdkajsdk',
    name: 'Toyota XYZ',
    plate: 'ABC1234',
    description: 'Your car of the year',
    year: 2022,
    color: 'red',
    price: 2099.99,
  };
  jest.spyOn(console, 'log').mockImplementation(jest.fn());

  test('Should return 400 if name is undefined', async () => {
    const { id, ...rest } = updateRequest;
    const response = await supertest.put('/vehicle')
      .expect('Content-Type', /json/)
      .send({
        ...rest,
        id: '',
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body.error).toEqual('É preciso passar o nome do carro.');
  });

  test('Should return 400 if name is undefined', async () => {
    const { name, ...rest } = updateRequest;
    const response = await supertest.put('/vehicle')
      .expect('Content-Type', /json/)
      .send({
        ...rest,
        name: '',
      });

    expect(response.statusCode).toEqual(400);
    expect(response.body.error).toEqual('É preciso passar o nome do carro.');
  });

  test('Should return 400 if plate is undefined', async () => {
    const { plate, ...rest } = updateRequest;
    const response = await supertest.put('/vehicle')
      .expect('Content-Type', /json/)
      .send({
        ...rest,
        plate: '',
      });

    expect(response.statusCode).toEqual(400);
  });

  test('Should return 400 if description is undefined', async () => {
    const { description, ...rest } = updateRequest;
    const response = await supertest.put('/vehicle')
      .expect('Content-Type', /json/)
      .send({
        ...rest,
        description: '',
      });

    expect(response.statusCode).toEqual(400);
  });

  test('Should return 400 if year is undefined', async () => {
    const { year, ...rest } = updateRequest;
    const response = await supertest.put('/vehicle')
      .expect('Content-Type', /json/)
      .send({
        ...rest,
        year: undefined,
      });

    expect(response.statusCode).toEqual(400);
  });

  test('Should return 400 if color is undefined', async () => {
    const { color, ...rest } = updateRequest;
    const response = await supertest.put('/vehicle')
      .expect('Content-Type', /json/)
      .send({
        ...rest,
        color: undefined,
      });

    expect(response.statusCode).toEqual(400);
  });

  test('Should return 400 if price is undefined', async () => {
    const { price, ...rest } = updateRequest;
    const response = await supertest.put('/vehicle')
      .expect('Content-Type', /json/)
      .send({
        ...rest,
        price: undefined,
      });

    expect(response.statusCode).toEqual(400);
  });

  test('Should return 400 if year is less than 0', async () => {
    const { year, ...rest } = updateRequest;
    const response = await supertest.put('/vehicle')
      .expect('Content-Type', /json/)
      .send({
        ...rest,
        year: -1,
      });

    expect(response.statusCode).toEqual(400);
  });

  test('Should return 400 if year is not a number', async () => {
    const { year, ...rest } = updateRequest;
    const response = await supertest.put('/vehicle')
      .expect('Content-Type', /json/)
      .send({
        ...rest,
        year: '-1',
      });

    expect(response.statusCode).toEqual(400);
  });

  test('Should return 400 if price is less than 0', async () => {
    const { price, ...rest } = updateRequest;
    const response = await supertest.put('/vehicle')
      .expect('Content-Type', /json/)
      .send({
        ...rest,
        price: -1,
      });

    expect(response.statusCode).toEqual(400);
  });

  test('Should return 400 if price is not a number', async () => {
    const { year, ...rest } = updateRequest;
    const response = await supertest.put('/vehicle')
      .expect('Content-Type', /json/)
      .send({
        ...rest,
        price: '-1',
      });

    expect(response.statusCode).toEqual(400);
  });

  test('Should return 200 if vehicle is created', async () => {
    jest.spyOn(VehicleRepository.prototype, 'edit').mockImplementationOnce(jest.fn());
    const response = await supertest.put('/vehicle')
      .expect('Content-Type', /json/)
      .send({
        ...updateRequest,
      });

    expect(response.statusCode).toEqual(200);
  });
});
