/* eslint-disable no-return-await */
/* eslint-disable no-restricted-syntax */
import { Request } from 'express';
import BadRequestError from '@err/BadRequestError';
import { validateNumber } from '@utils/validations';

/* eslint-disable no-param-reassign */
export interface IsFieldNumberValidProps {
  fields: string[]
  errorMessages: string[]
}

const IsValidYear = ({
  fields, errorMessages,
}: IsFieldNumberValidProps) => (target: any, key: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const { body } = args[0] as Request;

    let messagePosition = 0;
    for (const field of fields) {
      if (body[field]) {
        if (!validateNumber(body[field])) {
          throw new BadRequestError(errorMessages[messagePosition]);
        }
      }
      messagePosition++;
    }

    return await originalMethod.apply(this, args);
  };

  return descriptor;
};

export default IsValidYear;
