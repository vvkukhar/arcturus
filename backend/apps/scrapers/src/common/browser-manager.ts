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
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
          '--window-size=1920,1080',
          '--disable-blink-features=AutomationControlled'
        ],
      });
    }
    if (!this.context) {
      const proxyStr = proxyManager.getRawProxy();
      this.context = await this.browser.newContext({
        proxy: proxyStr ? { server: proxyStr } : undefined,
        viewport: { width: 1920, height: 1080 },
        userAgent: getRandomUserAgent(),
        ignoreHTTPSErrors: true,
        javaScriptEnabled: true,
        extraHTTPHeaders: {
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1'
        }
      });
    }
  }

  async fetchHtml(url: string, waitForSelector?: string): Promise<string> {
    await this.init();
    
    if (!this.context) {
      throw new Error('Browser not initialized');
    }

    const page = await this.context.newPage();

    // 🔥 АГРЕСИВНЕ БЛОКУВАННЯ ТРАФІКУ 🔥
    // Не вантажимо картинки, стилі, шрифти та медіа. 
    // Це прискорює резидентні проксі в 10 разів і економить твої гроші.
    await page.route('**/*', (route) => {
      const type = route.request().resourceType();
      const reqUrl = route.request().url();
      
      if (
        ['image', 'media', 'font', 'stylesheet', 'other'].includes(type) ||
        reqUrl.includes('google-analytics') || 
        reqUrl.includes('doubleclick') || 
        reqUrl.includes('tracker')
      ) {
        route.abort('aborted').catch(() => {});
      } else {
        route.continue().catch(() => {});
      }
    });

    try {
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
      });

      // Збільшено таймаут до 60с, оскільки резидентні IP можуть трохи "думати"
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

      if (waitForSelector) {
        await page.waitForSelector(waitForSelector, { state: 'attached', timeout: 15000 }).catch(() => {});
      } else {
        await page.waitForTimeout(3000 + Math.random() * 2000);
      }

      return await page.content();
    } catch (e: any) {
      console.error(`[BrowserManager] ERROR fetching ${url}:`, e.message);
      throw e;
    } finally {
      await page.close().catch(() => {});
    }
  }

  async restart(): Promise<void> {
    await this.close();
  }

  async close(): Promise<void> {
    if (this.context) { 
      await this.context.close().catch(()=>{}); 
      this.context = null; 
    }
    if (this.browser) { 
      await this.browser.close().catch(()=>{}); 
      this.browser = null; 
    }
  }
}

export const browserManager = new BrowserManager();