/* eslint-disable no-useless-constructor */
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { VehicleControlAdapter } from '@adapters/VehicleControlAdapter';
import { Controller } from '@decApi/Controller';
import { Locator } from '@repo/VehicleRepository';
import ApiRouter from '@decApi/ApiRouter';
import Catch from '@decorators/handlers/Catch';
import NotEmpty from '@validations/NotEmpty';

@Controller('/vehicle')
export class VehicleController {
  constructor(@inject(Locator.VehicleRepository) private repository: VehicleControlAdapter) {}

  @ApiRouter({
    method: 'get',
    path: '/',
  })
  @Catch()
  async getAllVehicles(req: Request, res: Response): Promise<Response> {
    const vehicles = await this.repository.getAll();

    return res.status(200).json({ content: vehicles });
  }

  @ApiRouter({
    method: 'get',
    path: '/id/:id',
  })
  @Catch()
  @NotEmpty({
    param: 'id',
    errorParamMessage: 'Necessário passar um id.',
    errorMessages: [],
    fields: [],
  })
  async getVehicleById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const vehicle = await this.repository.getVehicleById(id);
    return res.status(200).json({ content: vehicle });
  }

  @ApiRouter({
    method: 'get',
    path: '/name/:name',
  })
  @Catch()
  @NotEmpty({
    param: 'name',
    errorParamMessage: 'Necessário passar um nome.',
    errorMessages: [],
    fields: [],
  })
  async getVehicleByName(req: Request, res: Response): Promise<Response> {
    const { name } = req.params;
    const vehicle = await this.repository.getVehicleByName(name);
    return res.status(200).json({ content: vehicle });
  }

  @ApiRouter({
    method: 'get',
    path: '/plate/:plate',
  })
  @Catch()
  @NotEmpty({
    param: 'plate',
    errorParamMessage: 'Necessario passar uma placa.',
    errorMessages: [],
    fields: [],
  })
  async getVehicleByPlate(req: Request, res: Response): Promise<Response> {
    const { plate } = req.params;
    const vehicle = await this.repository.getVehicleByPlate(plate);
    return res.status(200).json({ content: vehicle });
  }

  @ApiRouter({
    method: 'get',
    path: '/fav',
  })
  @Catch()
  async getFavorites(req: Request, res: Response): Promise<Response> {
    const vehicles = await this.repository.getFavorites();
    return res.status(200).json({ content: vehicles });
  }

  @ApiRouter({
    method: 'get',
    path: '/search/',
  })
  @Catch()
  @NotEmpty({
    fields: [],
    errorMessages: [],
    useQuery: true,
  })
  async findWithSearchInfo(req: Request, res: Response): Promise<Response> {
    const { query } = req;

    const vehicles = await this.repository.filterByMultipleFields(query);
    return res.status(200).json({ content: vehicles });
  }
}
