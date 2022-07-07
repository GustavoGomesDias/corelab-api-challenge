import { VehicleControlAdapter } from '@adapters/VehicleControlAdapter';
import VehicleRepository from '../../repositories/VehicleRepository';

const makeVehicleRepository = (): VehicleControlAdapter => new VehicleRepository();

export default makeVehicleRepository;
