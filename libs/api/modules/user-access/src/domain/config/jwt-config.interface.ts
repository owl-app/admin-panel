export const JWT_CONFIG_NAME = 'jwt';

export interface IJwtConfig {
  secret: string;
  expiration_time: number;
  refresh_token_secret: string;
  refresh_token_expiration_time: number;
}