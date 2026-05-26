import axios from 'axios';
import axiosRetry from 'axios-retry';
import { proxyManager } from './proxy-manager';
import { getRandomUserAgent } from './user-agents';

export const httpClient = axios.create({
  timeout: 20000,
  maxRedirects: 5,
  validateStatus: (status) => status >= 200 && status < 400,
});

axiosRetry(httpClient, {
  retries: 4,
  retryDelay: (retryCount: number) => {
    return axiosRetry.exponentialDelay(retryCount) + Math.random() * 1000;
  },
  retryCondition: (error: any) => {
    const status = error.response?.status;
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || status === 429 || status === 403 || status === 503;
  },
});

// Interceptor для REQUEST (вибір проксі)
httpClient.interceptors.request.use((config) => {
  config.headers['User-Agent'] = getRandomUserAgent();
  // ... (твої стандартні хедери)
  
  const proxyStr = proxyManager.getRawProxy();
  if (proxyStr) {
    try {
      const url = new URL(proxyStr);
      config.proxy = {
        protocol: url.protocol.replace(':', ''),
        host: url.hostname,
        port: parseInt(url.port),
        auth: url.username ? { username: url.username, password: url.password } : undefined
      };
      // Додаємо URL проксі в config, щоб потім витягнути його в інтерцепторі відповіді
      (config as any)._proxyUsed = proxyStr;
    } catch (e) {
      console.error('[HttpClient] Failed to set proxy', e);
    }
  }
  return config;
});

// Interceptor для RESPONSE (репортуємо результат)
httpClient.interceptors.response.use(
  (response) => {
    const proxyUsed = (response.config as any)._proxyUsed;
    proxyManager.reportSuccess(proxyUsed);
    return response;
  },
  (error) => {
    const proxyUsed = (error.config as any)?._proxyUsed;
    const status = error.response?.status;
    
    // Якщо отримали статус, який вказує на бан або перевантаження
    if (status === 403 || status === 429 || status === 503) {
      proxyManager.reportFailure(proxyUsed);
    }
    
    return Promise.reject(error);
  }
);