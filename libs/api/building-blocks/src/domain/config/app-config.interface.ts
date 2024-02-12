type QueryConfig = { 
	default_limit: number;
}

export const APP_CONFIG_NAME = 'app';

export interface IConfigApp {
  version: string;
  app_name: string;
  host: string;
  port: number;
  password_bcrypt_salt_rounds: number;
  query: QueryConfig;
}