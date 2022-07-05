import ApiRouter from '@decApi/ApiRouter';
import { Controller } from '@decApi/Controller';
import Catch from '@decorators/handlers/Catch';
import { Request, Response } from 'express';

@Controller('/api')
export class Api {
  @ApiRouter({
    method: 'get',
    path: '/',
  })
  @Catch()
  sendStartMessage(req: Request, res: Response) {
    return res.status(200).json({ message: 'API up!' });
  }
}
