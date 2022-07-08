/* eslint-disable import/no-unresolved */
import { AddVehicle, EditVehicle } from '@usecases/index';
import { Vehicle } from '@models/Vehicle';

export interface VehicleControlAdapter {
getAll(): Promise<Vehicle[]>
getVehicleById(id: string): Promise<Vehicle>
getVehicleByName(name: string): Promise<Vehicle>
getVehicleByPlate(plate: string): Promise<Vehicle>
getFavorites(): Promise<Vehicle[]>
findInAnyFieldWithSearchInfo(info: string): Promise<Vehicle[]>
filterByMultipleFields(filters: Record<any, any>): Promise<Vehicle[]>

makeUniques(): Promise<void>
create(vehicle: AddVehicle): Promise<void>
edit(vehicle: EditVehicle): Promise<void>
delete(id: string): Promise<void>
}
