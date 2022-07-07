import request from 'supertest';
import app from '../../../app';

describe('Handle create API route', () => {
  const supertest: request.SuperTest<request.Test> = request('http://localhost:3001'); // = request(app);
  const createRequest = {
    name: 'Toyota XYZ',
    plate: 'ABC1234',
    description: 'Your car of the year',
    year: 2022,
    color: 'red',
    price: 2099.99,
  };
  jest.spyOn(console, 'log').mockImplementation(jest.fn());

  test('Should return 400 if name is undefined', async () => {
    const { name, ...rest } = createRequest;
    const response = await supertest.post('/vehicle')
      .expect('Content-Type', /json/)
      .send({
        ...rest,
        name: '',
      });

    expect(response.statusCode).toEqual(400);
  });

  test('Should return 400 if plate is undefined', async () => {
    const { plate, ...rest } = createRequest;
    const response = await supertest.post('/vehicle')
      .expect('Content-Type', /json/)
      .send({
        ...rest,
        plate: '',
      });

    expect(response.statusCode).toEqual(400);
  });

  test('Should return 400 if description is undefined', async () => {
    const { description, ...rest } = createRequest;
    const response = await supertest.post('/vehicle')
      .expect('Content-Type', /json/)
      .send({
        ...rest,
        description: '',
      });

    expect(response.statusCode).toEqual(400);
  });

  test('Should return 400 if year is undefined', async () => {
    const { year, ...rest } = createRequest;
    const response = await supertest.post('/vehicle')
      .expect('Content-Type', /json/)
      .send({
        ...rest,
        year: undefined,
      });

    expect(response.statusCode).toEqual(400);
  });

  test('Should return 400 if year is undefined', async () => {
    const { color, ...rest } = createRequest;
    const response = await supertest.post('/vehicle')
      .expect('Content-Type', /json/)
      .send({
        ...rest,
        color: undefined,
      });

    expect(response.statusCode).toEqual(400);
  });

  test('Should return 400 if year is undefined', async () => {
    const { price, ...rest } = createRequest;
    const response = await supertest.post('/vehicle')
      .expect('Content-Type', /json/)
      .send({
        ...rest,
        price: undefined,
      });

    expect(response.statusCode).toEqual(400);
  });
});
