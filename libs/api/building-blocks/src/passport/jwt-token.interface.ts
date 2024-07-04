export interface IJwtTokenPayload {
  email: string;
}

export interface IJwtTokenService<User> {
  checkToken(token: string): Promise<any>;

  createToken(payload: IJwtTokenPayload, secret: string, expiresIn: string): string;

  getJwtToken(email: string): Promise<string>;

  getJwtRefreshToken(email: string): Promise<string>;

  validateToken(pass: string, passwordHash: string): Promise<boolean>;

  validateUserForJWTStragtegy(email: string): Promise<User|null>;

  getUserIfRefreshTokenMatches(refreshToken: string, email: string): Promise<User|null>;
}

export const IJwtTokenService = Symbol('IJwtTokenService');