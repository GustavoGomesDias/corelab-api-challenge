/* eslint-disable no-param-reassign */
import { Response } from 'express';
import handleErrors from '@err/handleErrors';

const Catch = () => (target: any, key: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (err) {
      console.log(err);
      const { error, statusCode } = handleErrors(err as Error);

      return (args[1] as Response).status(statusCode).json({ error });
    }
  };

  return descriptor;
};

export default Catch;
