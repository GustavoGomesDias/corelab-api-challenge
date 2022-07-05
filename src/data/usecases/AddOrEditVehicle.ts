/* eslint-disable import/no-unresolved */
import { Vehicle } from '@models/Vehicle';

export type AddOrEditVehicle = Omit<Vehicle, '_id' | 'createdAt'>
