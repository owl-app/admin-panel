import { RequestContext } from "@owl-app/request-context-nestjs"
import { IUser } from "@owl-app/lib-contracts"

export class AppRequestContext extends RequestContext {
  requestId: string;
  user: IUser
}

export class RequestContextService {
  static getContext(): AppRequestContext {
    const ctx: AppRequestContext = RequestContext.currentContext.req;
    return ctx;
  }

  static getRequestId(): string {
    return this.getContext().requestId;
  }

  static getCurrentUser(): IUser | null {
    const requestContext = this.getContext();
    return (requestContext && requestContext.user) || null;
  }

  static getCurrentUserId(): string|null {
    const user: IUser|null = RequestContextService.getCurrentUser();
    if (user) {
      return user.id;
    }

    return null;
  }
}
