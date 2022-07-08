/* eslint-disable no-underscore-dangle */
import * as mockdb from '@db/db';
import VehicleRepository from '@repo/VehicleRepository';
import { Db, MongoClient } from 'mongodb';

describe('Handle get favorites API route', () => {
  jest.spyOn(console, 'log').mockImplementation(jest.fn());
  let cachedClient: MongoClient | null = null;
  let cachedDb: Db | null = null;

  beforeEach(async () => {
    const clientConnect = await MongoClient.connect(((global as unknown as { [key: string]: string }).__MONGO_URI__));
    const dbConnect = clientConnect.db((global as unknown as { [key: string]: string }).__MONGO_DB_NAME__);

    cachedClient = clientConnect;
    cachedDb = dbConnect;
    jest.spyOn(mockdb, 'connect').mockImplementationOnce(async () => ({
      cachedClient, cachedDb,
    }));
  });

  afterAll(async () => {
    await cachedClient?.close();
  });

  test('Should return an empty array if no exists favorites vehicles', async () => {
    const repository = new VehicleRepository();
    const spy = jest.spyOn(mockdb.cachedDb as Db, 'collection');
    await repository.getAll();
    expect(spy).toHaveBeenCalled();
  });
});
