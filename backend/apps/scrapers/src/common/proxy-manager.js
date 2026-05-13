"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyManager = exports.ProxyManager = void 0;
class ProxyManager {
    constructor() {
        this.proxies = [];
        this.currentIndex = 0;
        const proxyList = process.env.PROXY_LIST?.split(',') || [];
        this.proxies = proxyList.map(p => p.trim()).filter(Boolean);
    }
    getRawProxy() {
        if (this.proxies.length === 0)
            return undefined;
        const proxyUrl = this.proxies[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.proxies.length;
        return proxyUrl;
    }
    getProxyCount() {
        return this.proxies.length;
    }
}
exports.ProxyManager = ProxyManager;
exports.proxyManager = new ProxyManager();
