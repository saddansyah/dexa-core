import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiCreatedResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiOkResponseStandard = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          data: {
            $ref: getSchemaPath(model),
          },
          meta: {
            type: 'object',
            properties: {
              body: { type: 'object' },
              query: { type: 'object' },
              params: { type: 'object' },
            },
          },
        },
      },
    }),
  );
};

export const ApiOkResponseStandardArray = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              $ref: getSchemaPath(model),
            },
          },
          meta: {
            type: 'object',
            properties: {
              body: { type: 'object' },
              query: { type: 'object' },
              params: { type: 'object' },
            },
          },
        },
      },
    }),
  );
};

export const ApiCreatedResponseStandard = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiCreatedResponse({
      schema: {
        type: 'object',
        properties: {
          data: {
            $ref: getSchemaPath(model),
          },
          meta: {
            type: 'object',
            properties: {
              body: { type: 'object' },
              query: { type: 'object' },
              params: { type: 'object' },
            },
          },
        },
      },
    }),
  );
};
