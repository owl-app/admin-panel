export interface Config {
  api: {
    baseUrl: string;
    prefix: string;
  }
}

const config: Config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prefix: import.meta.env.VITE_API_PREFIX
  }
}

export default config;