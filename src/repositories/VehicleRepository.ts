/* eslint-disable no-restricted-syntax */
import { injectable } from 'inversify';
import { ObjectId, Db } from 'mongodb';
import { VehicleControlAdapter } from '@adapters/VehicleControlAdapter';
import { Vehicle } from '@models/Vehicle';
import { AddVehicle, EditVehicle } from '@usecases/index';
import { connect } from '@db/db';

@injectable()
export default class VehicleRepository implements VehicleControlAdapter {
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

  async findInAnyFieldWithSearchInfo(info: string): Promise<Vehicle[]> {
    const { cachedDb } = await connect();

    const vehicle: Vehicle[] = (await (cachedDb as Db).collection('vehicle').find({
      $or: [
        { name: { $in: [info] } },
        { plate: { $in: [info] } },
        { description: { $in: [info] } },
        { year: { $in: [info] } },
        { color: { $in: [info] } },
        { price: { $in: [info] } },
      ],
    }).toArray()) as unknown as Vehicle[];
    return vehicle;
  }

  async filterByMultipleFields(filters: Record<any, any>): Promise<Vehicle[]> {
    const { cachedDb } = await connect();
    const keys = Object.keys(filters);
    const andArray: Record<any, any>[] = [];
    for (const key of keys) {
      andArray.push({
        [key]: filters[key],
      });
    }

    const vehicle: Vehicle[] = (await (cachedDb as Db).collection('vehicle').find({
      $and: andArray,
    }).toArray()) as unknown as Vehicle[];
    return vehicle;
  }

  async create(vehicle: AddVehicle): Promise<void> {
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

export const Locator = {
  VehicleRepository: Symbol.for('CarRepository'),
};
