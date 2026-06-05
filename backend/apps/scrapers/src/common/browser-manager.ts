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
      console.log('[BrowserManager] Launching optimized Chromium...');
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-extensions',
          '--disable-background-networking',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-breakpad',
          '--disable-component-extensions-with-background-pages',
          '--disable-ipc-flooding-protection',
          '--disable-renderer-backgrounding',
          '--enable-features=NetworkService,NetworkServiceInProcess',
          '--force-color-profile=srgb',
          '--metrics-recording-only',
          '--js-flags="--max-old-space-size=256"', // 🔥 Жорстко обмежуємо RAM для JS до 256MB
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
    if (!this.context) throw new Error('Browser context not initialized');

    const page = await this.context.newPage();

    // 🔥 Блокуємо ВСЕ зайве, щоб вантажився ТІЛЬКИ голий HTML. Економія пам'яті х10.
    await page.route('**/*', (route) => {
      const type = route.request().resourceType();
      if (['image', 'media', 'font', 'stylesheet', 'websocket', 'other', 'script'].includes(type)) {
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
  }

  async close(): Promise<void> {
    if (this.context) {
      await this.context.close().catch(() => {});
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close().catch(() => {});
      this.browser = null;
    }
    console.log('[BrowserManager] Browser closed and memory freed.');
  }
}

export const browserManager = new BrowserManager();