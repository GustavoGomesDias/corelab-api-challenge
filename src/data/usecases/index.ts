import { Vehicle } from '@models/Vehicle';

export type AddVehicle = Omit<Vehicle, '_id' | 'createdAt' | 'isFavorite'>;

export interface EditVehicle extends Omit<Vehicle, '_id'> {
  id: string
}
