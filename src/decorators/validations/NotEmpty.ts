/* eslint-disable no-return-await */
/* eslint-disable no-restricted-syntax */
import { Request } from 'express';
import BadRequestError from '@err/BadRequestError';
import { isObject, validationField, isEmptyObject } from '@utils/validations';

/* eslint-disable no-param-reassign */
export interface IsFieldValidProps {
  fields: string[]
  errorMessages: string[]
  param?: string
  useQuery?: boolean
  errorParamMessage?: string
  isEditAction?: boolean
}

const NotEmpty = ({
  fields, errorMessages, param, errorParamMessage, useQuery, isEditAction,
}: IsFieldValidProps) => (target: any, key: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const { body, params, query } = args[0] as Request;
    if (!isObject(query)) {
      throw new BadRequestError('Por algum motivo, não veio os dados para filtragem.');
    }

    if (!isEmptyObject(query)) {
      throw new BadRequestError('Por algum motivo, não veio os dados para filtragem.');
    }

    if (param) {
      if (!validationField(params[param])) {
        throw new BadRequestError(errorParamMessage as string);
      }
    }

    if (!isEditAction) {
      if (fields.length > 0) {
        let messagePosition = 0;
        for (const field of fields) {
          if (!validationField(body[field])) {
            throw new BadRequestError(errorMessages[messagePosition]);
          }

          messagePosition++;
        }
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (fields.length > 0) {
        let messagePosition = 0;
        for (const field of fields) {
          if (body[field]) {
            if (!validationField(body[field])) {
              throw new BadRequestError(errorMessages[messagePosition]);
            }

            messagePosition++;
          }
        }
      }
    }
    return await originalMethod.apply(this, args);
  };

  return descriptor;
};

export default NotEmpty;
