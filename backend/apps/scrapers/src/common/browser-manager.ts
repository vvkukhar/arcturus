import { chromium, Browser, BrowserContext } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import { proxyManager } from './proxy-manager';

chromium.use(stealth());

export class BrowserManager {
  private browser: Browser | null = null;

  async init(): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process'
        ],
      });
    }
  }

  async fetchHtml(url: string): Promise<string> {
    await this.init();
    
    const proxyStr = proxyManager.getRawProxy();
    const proxyConfig = proxyStr ? { server: proxyStr } : undefined;

    const context: BrowserContext = await this.browser!.newContext({
      proxy: proxyConfig,
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();

    await page.route('**/*', (route) => {
      const type = route.request().resourceType();
      if (['image', 'media', 'font', 'stylesheet'].includes(type)) {
        route.abort();
      } else {
        route.continue();
      }
    });

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(Math.random() * 2000 + 1500);
      return await page.content();
    } finally {
      await context.close();
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const browserManager = new BrowserManager();