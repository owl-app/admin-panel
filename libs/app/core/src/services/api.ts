import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { snakeCase } from 'lodash';
import PQueue, { Options, QueueAddOptions } from 'p-queue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vuestic-ui/web-components';

import { useLatencyStore } from '../stores/latency';
import { useRequestsStore } from '../stores/requests';
import { translateAPIError } from '../application/lang';

const { init: notify } = useToast();

const api = axios.create({
  // baseURL: getRootPath(),
  baseURL: 'http://localhost:3000/api/v1/',
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
      // await sdk.getToken().catch(() => {
      // 	/* fail gracefully */
      // });


      if (requestConfig.measureLatency) requestConfig.start = performance.now();

      return resolve(requestConfig);
    });
  });
};

export const onResponse = (response: AxiosResponse | Response): AxiosResponse | Response => {
  onRequestEnd(response);
  return response;
};

export const onError = async (error: RequestError): Promise<RequestError> => {
  onRequestEnd(error.response);

  const { data } = error.response;

  notify({
    message: translateAPIError(data.message),
    color: 'danger',
    position: 'bottom-right',
    offsetY: 30
  })

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
