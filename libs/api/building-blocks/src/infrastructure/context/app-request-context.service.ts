import { Injectable } from "@nestjs/common"
import { IUser } from "@owl-app/lib-contracts"

import { AppRequestContext } from './app-request-context'

@Injectable()
export class AppRequestContextService {
  get currentUser(): IUser | null {
    const requestContext = this.currentRequest;
    return (requestContext && requestContext.req.user) || null;
  }

  get currentUserId(): string|null {
		const user: IUser|null = this.currentUser;
		if (user) {
			return user.id;
		}
		return null;
	}

  get currentRequestId(): string | undefined {
    return AppRequestContext.get()?.req.requestId;
  }

  private get currentRequest() {
    const requestContext = AppRequestContext.get();
    return requestContext || null;
  }
}