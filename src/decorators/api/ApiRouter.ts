/* eslint-disable no-return-await */
/* eslint-disable no-param-reassign */
import { Request, Response } from 'express';

export interface ApiRouterProps {
  method: 'get' | 'post' | 'put' | 'delete'
  path: string
}

export interface ApiRouterDefinition extends ApiRouterProps {
  controllerMethod: string | symbol
}

const ApiRouter = ({ method, path }: ApiRouterProps) => (target: any, key: string, descriptor: PropertyDescriptor): void => {
  if (!Reflect.hasMetadata('routes', target.constructor)) {
    Reflect.defineMetadata('routes', [], target.constructor);
  }
  const routes = Reflect.getMetadata('routes', target.constructor) as Array<ApiRouterDefinition>;
  routes.push({
    method,
    path,
    controllerMethod: key,
  });
  Reflect.defineMetadata('routes', routes, target.constructor);
};

export default ApiRouter;
