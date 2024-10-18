import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import PQueue, { Options, QueueAddOptions } from 'p-queue';
import { useToast } from 'vuestic-ui/web-components';

import { useLatencyStore } from '../stores/latency';
import { useRequestsStore } from '../stores/requests';
import { useUserStore } from '../stores/user';
import { translateAPIError } from '../application/lang';
import Config from '../config';

const { init: notify } = useToast();

let isRefreshing = false;

const api = axios.create({
  baseURL: Config.api.baseUrl + Config.api.prefix,
  withCredentials: true,
});

export let requestQueue: PQueue = new PQueue({
  concurrency: 5,
  intervalCap: 5,
  interval: 500,
  carryoverConcurrencyCount: true,
});

export type RequestConfig = InternalAxiosRequestConfig & { measureLatency?: boolean };

type InternalRequestConfig = RequestConfig & { id: string; start?: number };
type Response = AxiosResponse & { config: RequestConfig };
export type RequestError = AxiosError & { response: Response };

export const onRequest = (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  const requestsStore = useRequestsStore();
  const id = requestsStore.startRequest();

  const requestConfig: InternalRequestConfig = {
    ...config,
    id,
  };

  return new Promise((resolve) => {
    requestQueue.add(async () => {
      const userStore = useUserStore();

      if (Date.now() > userStore.accessTokenExpiry && Date.now() < userStore.refreshTokenExpiry && !isRefreshing) {
        isRefreshing = true;
        await userStore.refresh();
        isRefreshing = false;
      }

      if (requestConfig.measureLatency) requestConfig.start = performance.now();

      return resolve(requestConfig);
    });
  });
};

export const onResponse = (response: AxiosResponse | Response): AxiosResponse | Response => {
  onRequestEnd(response);
  return response;
};

export const onError = async (error: RequestError): Promise<RequestError | void> => {
  if (error.response.status === 401) {
    const userStore = useUserStore();

    await userStore.logout(false);

    return Promise.reject();
  }
 
  onRequestEnd(error.response);

  const { data } = error.response;

  if (error.response.status !== 422) {
    notify({
      message: translateAPIError(data.message),
      color: 'danger',
      position: 'bottom-right',
      offsetY: 30
    })
  }

  return Promise.reject(error);
};

api.interceptors.request.use(onRequest);
api.interceptors.response.use(onResponse, onError);

export default api;

export function resumeQueue() {
  if (!requestQueue.isPaused) return;
  requestQueue.start();
}

export async function replaceQueue(options?: Options<any, QueueAddOptions>) {
  await requestQueue.onIdle();
  requestQueue = new PQueue(options);
}

function onRequestEnd(response?: AxiosResponse | Response) {
  // Note: Cancelled requests don't respond with the config
  const config = response?.config as InternalRequestConfig | undefined;

  if (config?.id) {
    const requestsStore = useRequestsStore();
    requestsStore.endRequest(config.id);
  }

  if (config?.start) {
    const end = performance.now();
    const latencyStore = useLatencyStore();

    latencyStore.save({
      timestamp: new Date(),
      latency: end - config.start,
    });
  }
}
