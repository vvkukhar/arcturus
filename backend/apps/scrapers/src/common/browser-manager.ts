import { chromium } from 'playwright-extra';
import { Browser, BrowserContext } from 'playwright';
import stealth from 'puppeteer-extra-plugin-stealth';
import { proxyManager } from './proxy-manager';
import { getRandomUserAgent } from './user-agents';

chromium.use(stealth());

export class BrowserManager {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;

  async init(): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ],
      });
    }
    if (!this.context) {
      const proxyStr = proxyManager.getRawProxy();
      this.context = await this.browser.newContext({
        proxy: proxyStr ? { server: proxyStr } : undefined,
        viewport: { width: 1280, height: 720 },
        userAgent: getRandomUserAgent(),
        ignoreHTTPSErrors: true,
      });
    }
  }

  async fetchHtml(url: string): Promise<string> {
    await this.init();
    if (!this.context) throw new Error('Browser not initialized');

    const page = await this.context.newPage();

    await page.route('**/*', (route) => {
      const type = route.request().resourceType();
      if (['image', 'media', 'font', 'stylesheet', 'websocket', 'other'].includes(type)) {
        route.abort().catch(() => {});
      } else {
        route.continue().catch(() => {});
      }
    });

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3000);
      return await page.content();
    } finally {
      await page.close().catch(() => {});
    }
  }

  async restart(): Promise<void> {
    await this.close();
  }

  async close(): Promise<void> {
    if (this.context) { await this.context.close().catch(()=>{}); this.context = null; }
    if (this.browser) { await this.browser.close().catch(()=>{}); this.browser = null; }
  }
}

export const browserManager = new BrowserManager();