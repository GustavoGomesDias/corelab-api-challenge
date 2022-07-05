/* eslint-disable import/no-unresolved */
import { AddOrEditVehicle } from '@usecases/AddOrEditVehicle';
import { Vehicle } from '@models/Vehicle';

export interface VehicleControlAdapter {
  getVehicleById(id: string): Promise<Vehicle>
  getVehicleByName(name: string): Promise<Vehicle>
  getVehicleByPlate(plate: string): Promise<Vehicle>
  getFavorites(): Promise<Vehicle[]>
  findInAnyFieldWithSearchInfo(): Promise<Vehicle[]>
  filterByMultipleFields(): Promise<Vehicle[]>

  create(vehicle: AddOrEditVehicle): Promise<void>
  edit(vehicle: AddOrEditVehicle): Promise<void>
  delete(id: string): Promise<void>
}
