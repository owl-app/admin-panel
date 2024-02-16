export interface IJwtServicePayload {
  email: string;
}

export interface IJwtService<User> {
  checkToken(token: string): Promise<any>;

  createToken(payload: IJwtServicePayload, secret: string, expiresIn: string): string;

  getJwtToken(email: string): Promise<string>;

  getJwtRefreshToken(email: string): Promise<string>;

  validateUserForLocalStragtegy(email: string, pass: string): Promise<User|null>;

  validateUserForJWTStragtegy(email: string): Promise<User|null>;

  getUserIfRefreshTokenMatches(refreshToken: string, email: string): Promise<User|null>;
}


export const IJwtService = Symbol('IJwtService');