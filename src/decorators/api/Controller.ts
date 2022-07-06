/* eslint-disable no-return-await */
/* eslint-disable no-param-reassign */
import { Router } from 'express';
import { ApiRouterDefinition } from './ApiRouter';

export const router = Router();

export const Controller = (prefix: string): ClassDecorator => (target) => {
  Reflect.defineMetadata('prefix', prefix, target);
  if (!Reflect.hasMetadata('routes', target)) {
    Reflect.defineMetadata('routes', [], target);
  }
  const routes: Array<ApiRouterDefinition> = Reflect.getMetadata('routes', target);
  routes.forEach((route: ApiRouterDefinition) => {
    router[route.method](`${prefix}${route.path}`, route.controllerMethod);
  });
};
