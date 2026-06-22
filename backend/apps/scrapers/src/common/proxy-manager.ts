export interface ProxyNode {
  url: string;
  failures: number;
  cooldownUntil: number;
}

export class ProxyManager {
  private pool: ProxyNode[] = [];
  private currentIndex = 0;
  private readonly MAX_FAILURES = 3;
  private readonly COOLDOWN_MS = 15 * 60 * 1000; // 15 хвилин кулдауну

  constructor() {
    const proxyList = process.env.PROXY_LIST?.split(',') || [];
    this.pool = proxyList
      .map(p => p.trim())
      // 🔥 ЗАХИСТ ВІД ДУРНЯ: Ігноруємо дефолтну заглушку, якщо ти забув її змінити
      .filter(p => p && !p.includes('user:pass@ip:port') && p.startsWith('http'))
      .map(url => ({ url, failures: 0, cooldownUntil: 0 }));
  }

  public getRawProxy(): string | undefined {
    if (this.pool.length === 0) return undefined;

    const now = Date.now();
    let attempts = 0;

    while (attempts < this.pool.length) {
      const proxy = this.pool[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.pool.length;

      if (now > proxy.cooldownUntil) {
        return proxy.url;
      }
      attempts++;
    }

    console.warn('[ProxyManager] ⚠️ All proxies are currently in cooldown!');
    return undefined;
  }

  public reportFailure(url: string | undefined): void {
    if (!url) return;
    
    const proxy = this.pool.find(p => p.url === url || p.url.includes(url));
    if (proxy) {
      proxy.failures += 1;
      console.warn(`[ProxyManager] Proxy failed: ${proxy.url}. Failure count: ${proxy.failures}`);
      
      if (proxy.failures >= this.MAX_FAILURES) {
        proxy.cooldownUntil = Date.now() + this.COOLDOWN_MS;
        proxy.failures = 0;
        console.error(`[ProxyManager] 🔴 Proxy burned! Sending to cooldown for 15 mins: ${proxy.url}`);
      }
    }
  }

  public reportSuccess(url: string | undefined): void {
    if (!url) return;
    const proxy = this.pool.find(p => p.url === url || p.url.includes(url));
    if (proxy && proxy.failures > 0) {
      proxy.failures = 0;
    }
  }

  public getProxyCount(): number {
    return this.pool.length;
  }
}

export const proxyManager = new ProxyManager();