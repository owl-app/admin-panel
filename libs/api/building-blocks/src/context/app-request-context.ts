import { RequestContext } from "@owl-app/request-context-nestjs"
import { AuthUserData } from "@owl-app/lib-contracts"

export class AppRequestContext extends RequestContext {
  requestId: string

  user: AuthUserData
}

export class RequestContextService {
  static getContext(): AppRequestContext {
    const ctx: AppRequestContext = RequestContext.currentContext.req;
    return ctx;
  }

  static getRequestId(): string {
    return this.getContext().requestId;
  }

  static getCurrentUser(): AuthUserData | null {
    const requestContext = this.getContext();
    return (requestContext && requestContext.user) || null;
  }

  static getCurrentUserId(): string|null {
    const user: AuthUserData|null = RequestContextService.getCurrentUser();
    if (user) {
      return user.id;
    }

    return null;
  }
}
