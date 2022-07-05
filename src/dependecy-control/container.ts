import VehicleRepository, { Locator } from '@repo/VehicleRepository';
import { VehicleControlAdapter } from '@adapters/VehicleControlAdapter';
import { Container } from 'inversify';

export const vehicleRepoContainer = new Container();
vehicleRepoContainer.bind<VehicleControlAdapter>(Locator.VehicleRepository).to(VehicleRepository);
