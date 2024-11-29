export interface Config {
  api: {
    baseUrl: string;
    prefix: string;
    tokenClockTolerance: number;
  }
}

const config: Config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prefix: import.meta.env.VITE_API_PREFIX,
    tokenClockTolerance: parseInt(import.meta.env.TOKEN_CLOCK_TOLERANCE) || 2000,
  }
}

export default config;