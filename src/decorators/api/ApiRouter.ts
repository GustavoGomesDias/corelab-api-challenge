/* eslint-disable no-return-await */
/* eslint-disable no-param-reassign */
import { Router, Request, Response } from 'express';

export interface ApiRouterProps {
  method: 'get' | 'post' | 'put' | 'delete'
  path: string
}

export interface ApiRouterDefinition extends ApiRouterProps {
  controllerMethod(req: Request, res: Response): any
}

const ApiRouter = ({ method, path }: ApiRouterProps) => (target: any, key: string, descriptor: PropertyDescriptor): void => {
  if (!Reflect.hasMetadata('routes', target.constructor)) {
    Reflect.defineMetadata('routes', [], target.constructor);
  }
  const routes = Reflect.getMetadata('routes', target.constructor) as Array<ApiRouterDefinition>;
  routes.push({
    method,
    path,
    controllerMethod: descriptor.value,
  });
  Reflect.defineMetadata('routes', routes, target.constructor);
};

export default ApiRouter;
