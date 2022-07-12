# Back-enders

O backend da aplicação tem tudo que é pedido no desafio, incluindo rota para pesquisa e filtragem, mas elas não foram usadas pelo backend, já que a filtragem foi feita usando os resultados que já tinha lá

Eu tentei usar o máximo que dava de uma arquitetura desacoplada, mas não consegui livrar a API totalmente do Express, apenas da persistência e do roteamento.

## Roteamento

O roteamento aqui é feito usando uma bibliotéca chamada Reflect e Decorators. O Reflect seria o equivalente das reflections do Java, por exemplo, mas como NodeJS não tem runtime, não funciona como as reflections do Java. (Essa eu também vou ficar devendo, eu sei que ela usa a API de Objects para fazer tudo, mas não sei como).

Bom, o decorator que mapeia a rota dos Controlers:

*[src/decorators/api]*
```ts
export const Controller = (prefix: string): ClassDecorator => (target) => {
  Reflect.defineMetadata('prefix', prefix, target);
};
```

Ela usa da reflexão para salvar o prefixo que será usado na rota, no caso do VehicleControler:
*[src/controllers/]*
```ts
@Controller('/vehicle')
class VehicleController {}
```

Assinando as rotas:
*[src/decorators/api]*
```ts
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
```

*[src/controllers/VehicleController]*
![image](https://user-images.githubusercontent.com/61890060/178385633-9afd1f03-6ccc-4781-af74-0956ca49b837.png)

A ApiRouter recebe um method (GET, POST, PUT, DELETE) e um path.

## Validações
As validações também são feitas com decorators:
![image](https://user-images.githubusercontent.com/61890060/178385960-92fdb9b5-416a-42ae-b51e-313192207ea9.png)

Pegondo NotEmpty como exemplo, temos que ele é um decorator bem complexo, ele valida o body da request, os params e até queries.

```ts
/* eslint-disable no-return-await */
/* eslint-disable no-restricted-syntax */
import { Request } from 'express';
import BadRequestError from '@err/BadRequestError';
import {
  isObject, validationField, isEmptyObject, isValidObject,
} from '@utils/validations';

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
    if (useQuery) {
      if (!isObject(query)) {
        throw new BadRequestError('Por algum motivo, não veio os dados para filtragem.');
      }

      if (isEmptyObject(query)) {
        throw new BadRequestError('Por algum motivo, não veio os dados para filtragem.');
      }

      if (!isValidObject(query)) {
        throw new BadRequestError('Por algum motivo, existem dados de filtragens nulos.');
      }
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

```
No caso do body e do param, você passa o que você quer garantir que não será vazio, undefined e etc, além de uma menssagem caso ele algum deles não seja válido.

Para o query, você diz se quer validar os campos dele, então o NotEmpty valida.

Existem outros validadores também.

## Relative paths
São os imports com @ 😎

## Tecnologias
- Express
- MongoDB
- Dotenv
- Cors
- Reflect API
- Nodemon
- ES Lint

## TDD
Tem um pouco de testes aqui, mas muito mais focado apenas nas rotas e nos controllers. Eu tentei fazer alguns testes de integração e TDD mais voltados pro repository, mas acabou que eu não consegui e com o tempo apertado, resolvi deixar ele para lá.

Emfim, eu usei Jest nos testes junto do Supertest.

