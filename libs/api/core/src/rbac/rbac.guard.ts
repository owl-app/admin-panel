import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { isPublicRoute } from '../utils/route';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const controllerPath = this.reflector.get<string>(
      PATH_METADATA,
      context.getClass()
    );
    const routeHandlerPath = this.reflector.get<string>(
      PATH_METADATA,
      context.getHandler()
    );

    if (!isPublicRoute(this.reflector, context)) {
      return true;
    }

    return true;
  }
}
