import { IS_AUTHENTICATED_USECASE, IsAuthenticatedUseCase } from "../../application/is-authenticated";

export const isAuthenticatedProvider = {
  provide: IS_AUTHENTICATED_USECASE,
  useClass: IsAuthenticatedUseCase
}