import { RequestContext } from "@owl-app/request-context-nestjs"
import { IUser } from "@owl-app/lib-contracts"

export interface AppRequest {
  requestId: number;
  user: IUser
}

export class AppRequestContext {
  static get(): RequestContext<AppRequest>|undefined {
    return RequestContext.currentContext;
  }
}