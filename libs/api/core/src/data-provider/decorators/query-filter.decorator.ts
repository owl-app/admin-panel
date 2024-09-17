import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const QueryFilter = createParamDecorator(
  (data = 'filters', ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.query[data] ?? {};
  }
);
