import { chromium } from 'playwright-extra';
import { Browser, BrowserContext } from 'playwright';
import stealth from 'puppeteer-extra-plugin-stealth';
import { proxyManager } from './proxy-manager';

chromium.use(stealth());

export class BrowserManager {
  private browser: Browser | null = null;
  private contexts: BrowserContext[] = [];
  private readonly MAX_CONTEXTS = 5;
  private contextRoundRobin = 0;

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
          '--js-flags=--max-old-space-size=1024',
        ],
      });

      for (let i = 0; i < this.MAX_CONTEXTS; i++) {
        const proxyStr = proxyManager.getRawProxy();
        const context = await this.browser.newContext({
          proxy: proxyStr ? { server: proxyStr } : undefined,
          viewport: { width: 1920, height: 1080 },
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        });
        this.contexts.push(context);
      }
    }
  }

  private getNextContext(): BrowserContext {
    const ctx = this.contexts[this.contextRoundRobin];
    this.contextRoundRobin = (this.contextRoundRobin + 1) % this.contexts.length;
    return ctx;
  }

  async fetchHtml(url: string): Promise<string> {
    await this.init();
    const context = this.getNextContext();
    const page = await context.newPage();

    await page.route('**/*', (route: any) => {
      const type = route.request().resourceType();
      if (['image', 'media', 'font', 'stylesheet', 'websocket'].includes(type)) {
        route.abort();
      } else {
        route.continue();
      }
    });

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      return await page.content();
    } finally {
      await page.close();
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await Promise.all(this.contexts.map(c => c.close()));
      await this.browser.close();
      this.browser = null;
      this.contexts = [];
    }
  }
}

export const browserManager = new BrowserManager();