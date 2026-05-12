export class ProxyManager {
  private proxies: string[] = [];
  private currentIndex = 0;

  constructor() {
    const proxyList = process.env.PROXY_LIST?.split(',') || [];
    this.proxies = proxyList.map(p => p.trim()).filter(Boolean);
  }

  public getRawProxy(): string | undefined {
    if (this.proxies.length === 0) return undefined;
    const proxyUrl = this.proxies[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.proxies.length;
    return proxyUrl;
  }

  public getProxyCount(): number {
    return this.proxies.length;
  }
}

export const proxyManager = new ProxyManager();