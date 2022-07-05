/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
export const validationField = (field: unknown) => !(field === '' || field === ' ' || field === null || field === undefined);

export function isEmptyObject(obj: object) {
  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      return false;
    }
  }
  return true;
}

export const isObject = (obj: unknown) => typeof obj === 'object' && obj !== null && !Array.isArray(obj);
