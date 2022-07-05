import { Vehicle } from '@models/Vehicle';

export type AddVehicle = Omit<Vehicle, '_id' | 'createdAt'>;
export type EditVehicle = {
  id: string
  infos: Partial<AddVehicle>;
}
