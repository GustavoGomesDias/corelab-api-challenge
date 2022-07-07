/* eslint-disable no-useless-constructor */
import { Request, Response } from 'express';
import { VehicleControlAdapter } from '@adapters/VehicleControlAdapter';
import ApiRouter from '@decApi/ApiRouter';
import { Controller } from '@decApi/Controller';
import Catch from '@decorators/handlers/Catch';
import NotEmpty from '@validations/NotEmpty';
import { EditVehicle } from '@usecases/index';
import makeVehicleRepository from '@injection/RepositoryFactory';
import IsFieldNumberValid from '@validations/IsFieldNumberValid';

@Controller('/vehicle')
class VehicleController {
  public repository: VehicleControlAdapter;

  constructor() {
    this.repository = makeVehicleRepository();
  }

  returnRepository() {
    console.log(this.repository.getAll);
  }

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

  @ApiRouter({
    method: 'post',
    path: '/',
  })
  @Catch()
  @NotEmpty({
    fields: ['name', 'plate', 'description', 'year', 'color', 'price'],
    errorMessages: [
      'É preciso passar o nome do carro.',
      'É preciso passar a placa do carro.',
      'É preciso passar uma descrição sobre o carro.',
      'É preciso passar o ano do carro.',
      'É preciso passar a cor do carro.',
      'É preciso passar o preço do carro.',
    ],
  })
  @IsFieldNumberValid({
    fields: ['year', 'price'],
    errorMessages: ['O ano do carro tem que ser maior que 1900.', 'O preço precisa ser maior que 0.'],
  })
  async addVehicle(req: Request, res: Response) {
    const { body } = req;

    // console.log(this.repository);
    await this.repository.create(body);
    return res.status(201).json({ message: 'Veículo criado com sucesso!' });
  }

  @ApiRouter({
    method: 'put',
    path: '/',
  })
  @Catch()
  @IsFieldNumberValid({
    fields: ['year', 'price'],
    errorMessages: ['O ano do carro tem que ser maior que 1900.', 'O preço precisa ser maior que 0.'],
  })
  async editVehicle(req: Request, res: Response) {
    const { body } = req;

    await this.repository.edit(body as EditVehicle);
    return res.status(200).json({ message: 'Veículo atualizado com sucesso!' });
  }

  @ApiRouter({
    method: 'delete',
    path: '/:id',
  })
  @Catch()
  @NotEmpty({
    fields: [],
    errorMessages: [],
    param: 'id',
    errorParamMessage: 'É preciso passar o id de um veículo para exclui-lo.',
  })
  async deleteVehicle(req: Request, res: Response) {
    const { id } = req.params;

    await this.repository.delete(id);
    return res.status(200).json({ message: 'Veículo deletado com sucesso!' });
  }
}

export default VehicleController;
