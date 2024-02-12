import { JwtTokenService } from "../jwt/services/jwt.service";

import { LOGIN_USECASE, LoginUseCase } from "../../application/login";

export const loginProvider = {
  inject: [JwtTokenService],
  provide: LOGIN_USECASE,
  useFactory: (
    jwtTokenService: JwtTokenService
  ) => new LoginUseCase(jwtTokenService),
}