import { Injectable, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as PassportAuthGaurd } from '@nestjs/passport'

export const PUBLIC_ROUTE_KEY = '_PUBLIC_ROUTE_';
export const Public = () => SetMetadata(PUBLIC_ROUTE_KEY, true);

@Injectable()
export class JwtAuthGuard  extends PassportAuthGaurd('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  override canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}