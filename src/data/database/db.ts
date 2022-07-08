/* eslint-disable import/no-mutable-exports */
import { MongoClient, Db } from 'mongodb';

export interface MongoReturn {
  cachedClient: MongoClient | null
  cachedDb: Db | null
}

export let cachedClient: MongoClient | null = null;
export let cachedDb: Db | null = null;

export const connect = async (): Promise<MongoReturn> => {
  if (cachedClient === null && cachedDb === null) {
    const clientConnect = await MongoClient.connect(process.env.DATABASE_URL as string);
    const dbConnect = clientConnect.db('core');
    cachedClient = clientConnect;
    cachedDb = dbConnect;
  }

  return {
    cachedClient, cachedDb,
  };
};
