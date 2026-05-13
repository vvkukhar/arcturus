"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpClient = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
const proxy_manager_1 = require("./proxy-manager");
const user_agents_1 = require("./user-agents");
exports.httpClient = axios_1.default.create({
    timeout: 20000,
    maxRedirects: 5,
    validateStatus: (status) => status >= 200 && status < 400,
});
(0, axios_retry_1.default)(exports.httpClient, {
    retries: 4,
    retryDelay: (retryCount) => {
        return axios_retry_1.default.exponentialDelay(retryCount) + Math.random() * 1000;
    },
    retryCondition: (error) => {
        const status = error.response?.status;
        return axios_retry_1.default.isNetworkOrIdempotentRequestError(error) || status === 429 || status === 403 || status === 503;
    },
});
exports.httpClient.interceptors.request.use((config) => {
    config.headers['User-Agent'] = (0, user_agents_1.getRandomUserAgent)();
    config.headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7';
    config.headers['Accept-Language'] = 'en-US,en;q=0.9,uk-UA;q=0.8,uk;q=0.7';
    config.headers['Cache-Control'] = 'max-age=0';
    config.headers['Upgrade-Insecure-Requests'] = '1';
    config.headers['Sec-Ch-Ua'] = '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"';
    config.headers['Sec-Ch-Ua-Mobile'] = '?0';
    config.headers['Sec-Ch-Ua-Platform'] = '"Windows"';
    const proxyStr = proxy_manager_1.proxyManager.getRawProxy();
    if (proxyStr) {
        try {
            const url = new URL(proxyStr);
            config.proxy = {
                protocol: url.protocol.replace(':', ''),
                host: url.hostname,
                port: parseInt(url.port),
                auth: url.username ? { username: url.username, password: url.password } : undefined
            };
        }
        catch {
        }
    }
    return config;
});
