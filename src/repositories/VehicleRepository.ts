/* eslint-disable no-restricted-syntax */
import { ObjectId, Db } from 'mongodb';
import { VehicleControlAdapter } from '@adapters/VehicleControlAdapter';
import { Vehicle } from '@models/Vehicle';
import { AddVehicle, EditVehicle } from '@usecases/index';
import { connect } from '@db/db';

export default class VehicleRepository implements VehicleControlAdapter {
  private createUniques = false;

  async makeUniques(): Promise<void> {
    const { cachedDb } = await connect();
    await cachedDb?.collection('vehicle').createIndex({ plate: 1 }, { unique: true });
  }

  async getAll(): Promise<Vehicle[]> {
    const { cachedDb } = await connect();
    const vehicles = await cachedDb?.collection('vehicle').find({}).toArray() as unknown as Vehicle[];

    return vehicles;
  }

  async getVehicleById(id: string): Promise<Vehicle> {
    const { cachedDb } = await connect();

    const vehicle: Vehicle = (await (cachedDb as Db).collection('vehicle').find({ _id: new ObjectId(id.trim()) }).toArray())[0] as unknown as Vehicle;
    return vehicle;
  }

  async getVehicleByName(name: string): Promise<Vehicle> {
    const { cachedDb } = await connect();

    const vehicle: Vehicle = (await (cachedDb as Db).collection('vehicle').find({ name }).toArray())[0] as unknown as Vehicle;
    return vehicle;
  }

  async getVehicleByPlate(plate: string): Promise<Vehicle> {
    const { cachedDb } = await connect();

    const vehicle: Vehicle = (await (cachedDb as Db).collection('vehicle').find({ plate }).toArray())[0] as unknown as Vehicle;
    return vehicle;
  }

  async getFavorites(): Promise<Vehicle[]> {
    const { cachedDb } = await connect();

    const vehicle: Vehicle[] = (await (cachedDb as Db).collection('vehicle').find({ isFavorite: true }).toArray()) as unknown as Vehicle[];
    return vehicle;
  }

  makeSearchQueryWithSearchInfo(info: unknown) {
    return [
      { name: { $in: [info] } },
      { plate: { $in: [info] } },
      { description: { $in: [info] } },
      { year: { $in: [info] } },
      { color: { $in: [info] } },
      { price: { $in: [info] } },
    ];
  }

  async findInAnyFieldWithSearchInfo(info: unknown): Promise<Vehicle[]> {
    const { cachedDb } = await connect();

    const searchQuery = this.makeSearchQueryWithSearchInfo(info);

    const vehicle: Vehicle[] = (await (cachedDb as Db).collection('vehicle').find({
      $or: searchQuery,
    }).toArray()) as unknown as Vehicle[];
    return vehicle;
  }

  makeSearchQueryWithMultipleFields(filters: Record<any, any>): Record<any, any>[] {
    const keys = Object.keys(filters);
    const searchQuery: Record<any, any>[] = [];
    for (const key of keys) {
      if (key !== 'priceMin' && key !== 'priceMax') {
        searchQuery.push({
          [key]: filters[key],
        });
      }
    }

    if (keys.indexOf('priceMin') >= 0 || keys.indexOf('priceMax')) {
      searchQuery.push({
        $or: [{ price: { $gt: filters.priceMin } }, { price: { $lt: filters.priceMax } }],
      });
    }

    return searchQuery;
  }

  async filterByMultipleFields(filters: Record<any, any>): Promise<Vehicle[]> {
    const { cachedDb } = await connect();
    const searchQuery = this.makeSearchQueryWithMultipleFields(filters);
    const vehicle: Vehicle[] = (await (cachedDb as Db).collection('vehicle').find({
      $and: searchQuery,
    }).toArray()) as unknown as Vehicle[];
    return vehicle;
  }

  async create(vehicle: AddVehicle): Promise<void> {
    if (!this.createUniques) {
      await this.makeUniques();
    }
    this.createUniques = true;
    const { cachedDb } = await connect();

    await cachedDb?.collection('vehicle').insertOne({
      ...vehicle,
      cretedAt: new Date(
        new Date().toLocaleString('en-US', {
          timeZone: 'America/Sao_Paulo',
        }),
      ),

      updatedAt: new Date(
        new Date().toLocaleString('en-US', {
          timeZone: 'America/Sao_Paulo',
        }),
      ),
    });
  }

  async edit(vehicle: EditVehicle): Promise<void> {
    const { cachedDb } = await connect();

    await cachedDb?.collection('vehicle').updateOne({ _id: new ObjectId(vehicle.id.trim()) }, {
      $set: {
        ...vehicle.infos,

        updatedAt: new Date(
          new Date().toLocaleString('en-US', {
            timeZone: 'America/Sao_Paulo',
          }),
        ),
      },
    });
  }

  async delete(id: string): Promise<void> {
    const { cachedDb } = await connect();
    await cachedDb?.collection('vehicle').deleteOne({ _id: new ObjectId(id.trim()) });
  }
}
