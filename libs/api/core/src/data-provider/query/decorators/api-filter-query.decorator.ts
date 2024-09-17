import {
  ApiExtraModels,
  ApiQuery,
  ApiQueryOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { isObjectOrFunction } from '@owl-app/utils';

export type ApiFilterQueryOptions = {
  name: string;
  filter: Function | string;
  options?: ApiQueryOptions;
};

export function ApiFilterQuery(options: ApiFilterQueryOptions[]) {
  let filterDecorators = [];

  filterDecorators = options.map(({ name, filter, options }) => {
    if (isObjectOrFunction(filter)) {
      return applyDecorators(
        ApiExtraModels(filter as Function),
        ApiQuery({
          required: false,
          name,
          style: 'deepObject',
          explode: true,
          type: 'object',
          schema: {
            $ref: getSchemaPath(filter),
          },
          ...options,
        })
      );
    } else {
      return applyDecorators(
        ApiQuery({
          required: false,
          name,
          explode: true,
          type: filter,
          ...options,
        })
      );
    }
  });

  return applyDecorators(...filterDecorators);
}
