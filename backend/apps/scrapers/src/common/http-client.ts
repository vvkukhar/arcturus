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

httpClient.interceptors.request.use((config) => {
  config.headers['User-Agent'] = getRandomUserAgent();
  config.headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7';
  config.headers['Accept-Language'] = 'en-US,en;q=0.9,uk-UA;q=0.8,uk;q=0.7';
  config.headers['Cache-Control'] = 'max-age=0';
  config.headers['Upgrade-Insecure-Requests'] = '1';
  config.headers['Sec-Ch-Ua'] = '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"';
  config.headers['Sec-Ch-Ua-Mobile'] = '?0';
  config.headers['Sec-Ch-Ua-Platform'] = '"Windows"';

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
    } catch {
    }
  }

  return config;
});