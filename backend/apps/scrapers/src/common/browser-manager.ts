import { chromium } from 'playwright-extra';
import { Browser, BrowserContext } from 'playwright';
import stealth from 'puppeteer-extra-plugin-stealth';
import { proxyManager } from './proxy-manager';
import { getRandomUserAgent } from './user-agents';

chromium.use(stealth());

export class BrowserManager {
  private browser: Browser | null = null;
  private contextPool: BrowserContext[] = [];
  private readonly MAX_CONTEXTS = parseInt(process.env.SCRAPER_MAX_CONTEXTS ?? '3', 10);
  private contextIndex = 0;

  async init(): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
          '--disable-dev-shm-usage',
          '--js-flags=--max-old-space-size=512',
          '--disable-extensions',
          '--disable-default-apps',
          '--mute-audio',
          '--no-first-run',
        ],
      });

      for (let i = 0; i < this.MAX_CONTEXTS; i++) {
        await this.createContext();
      }
    }
  }

  private async createContext(): Promise<void> {
    if (!this.browser) return;
    const proxyStr = proxyManager.getRawProxy();
    const context = await this.browser.newContext({
      proxy: proxyStr ? { server: proxyStr } : undefined,
      viewport: { width: 1920, height: 1080 },
      userAgent: getRandomUserAgent(),
      ignoreHTTPSErrors: true,
    });
    this.contextPool.push(context);
  }

  private async getNextContext(): Promise<BrowserContext> {
    if (this.contextPool.length === 0) await this.init();
    const ctx = this.contextPool[this.contextIndex];
    this.contextIndex = (this.contextIndex + 1) % this.contextPool.length;
    return ctx;
  }

  async fetchHtml(url: string): Promise<string> {
    // ФІКС: Прибрано логіку рестарту посеред запитів, щоб уникнути Race Condition
    await this.init();
    const context = await this.getNextContext();
    const page = await context.newPage();

    await page.route('**/*', (route) => {
      const type = route.request().resourceType();
      if (['image', 'media', 'font', 'stylesheet', 'websocket', 'other'].includes(type)) {
        route.abort().catch(() => {});
      } else {
        route.continue().catch(() => {});
      }
    });

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
      return await page.content();
    } finally {
      await page.close().catch(() => {});
    }
  }

  async restart(): Promise<void> {
    await this.close();
    await this.init();
  }

  async close(): Promise<void> {
    if (this.browser) {
      await Promise.allSettled(this.contextPool.map(c => c.close()));
      await this.browser.close();
      this.browser = null;
      this.contextPool = [];
    }
  }
}

export const browserManager = new BrowserManager();