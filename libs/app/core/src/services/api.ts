import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import PQueue, { Options, QueueAddOptions } from 'p-queue';
import { useToast } from 'vuestic-ui/web-components';

import { useLatencyStore } from '../stores/latency';
import { useRequestsStore } from '../stores/requests';
import { useUserStore } from '../stores/user';
import { translateAPIError } from '../application/lang';
import Config from '../config';

export type RequestConfig = InternalAxiosRequestConfig & { measureLatency?: boolean };

type InternalRequestConfig = RequestConfig & { id: string; start?: number };
type Response = AxiosResponse & { config: RequestConfig };
type Callback = () => void;

export type RequestError = AxiosError & { response: Response };

const { init: notify } = useToast();

let isRefreshing = false;
const baseURL = Config.api.baseUrl + Config.api.prefix;
const cancelTokenSource = axios.CancelToken.source();

const api = axios.create({
  baseURL,
  withCredentials: true,
  cancelToken: cancelTokenSource.token,
});

let refreshRequests: Callback[] = [];

const registerRequest = (callback: Callback) => {
  refreshRequests.push(callback);
};

const onRrefreshed = async () => {
  refreshRequests.forEach(async (callback) => await callback());
  refreshRequests = [];
};

export const onRequest = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  const userStore = useUserStore();
  const requestsStore = useRequestsStore();
  const id = requestsStore.startRequest();
  const requestConfig: InternalRequestConfig = {
    ...config,
    id,
  };

  console.log('Before Request', config.url);

  if (Date.now() > userStore.accessTokenExpiry && Date.now() < userStore.refreshTokenExpiry) {
    if (!isRefreshing) {
      try {
        isRefreshing = true;

        const { data } = await axios.post(`${baseURL}/auth/refresh`, null, { withCredentials: true });

        userStore.logged(data.accessTokenExpires, data.refreshTokenExpires);

        isRefreshing = false;

        onRrefreshed();
      } catch (error) {
        console.log('Error refreshing token', error);
        isRefreshing = false;
        userStore.logout(false);
        return Promise.reject(error);
      }

      return requestConfig;
    }

    return new Promise((resolve) => {
      registerRequest(() => {
        resolve(requestConfig);
      });
    });
  }

  if (userStore.authenticated && Date.now() > userStore.refreshTokenExpiry) {
    cancelTokenSource.cancel('Session expired');
    api.defaults.cancelToken = axios.CancelToken.source().token;
    console.log('Session expired');
    return Promise.reject({ response: { status: 401,  data: { message: 'Session expired' } } });
  }

  console.log('After Request', config.url);

  return requestConfig;
};

export const onResponse = (response: AxiosResponse | Response): AxiosResponse | Response => {
  onRequestEnd(response);
  return response;
};

export const onError = async (error: RequestError): Promise<RequestError | void> => {
  console.log('error', error);
  if (error?.response?.status === 401) {
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
