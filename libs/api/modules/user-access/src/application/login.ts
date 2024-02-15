import {
  IJwtService
} from '../domain/services/jwt.interface';

export const LOGIN_USECASE = 'LoginUseCase';

export type AccessTokens = {
  accessToken: string;
  refreshToken: string;
}

export class LoginUseCase<User> {
  constructor(
    private readonly jwtTokenService: IJwtService<User>,
  ) {}

  async execute(email: string): Promise<AccessTokens> {
    const accessToken = await this.jwtTokenService.getJwtToken(email);
    const refreshToken = await this.jwtTokenService.getJwtRefreshToken(email);

    return { accessToken, refreshToken }
  }
}
