/* eslint-disable no-return-await */
/* eslint-disable no-param-reassign */
import { Router } from 'express';

export const router = Router();

export const Controller = (prefix: string): ClassDecorator => (target) => {
  Reflect.defineMetadata('prefix', prefix, target);
};
