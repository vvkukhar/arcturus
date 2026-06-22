import { chromium } from 'playwright-extra';
import { Browser } from 'playwright';
import stealth from 'puppeteer-extra-plugin-stealth';
import { proxyManager } from './proxy-manager';
import { getRandomUserAgent } from './user-agents';

chromium.use(stealth());

export class BrowserManager {
  private browser: Browser | null = null;

  async init(): Promise<void> {
    if (!this.browser) {
      console.log('[BrowserManager] Launching new chromium browser...');
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
      console.log('[BrowserManager] Browser launched successfully');
    }
  }

  async fetchHtml(url: string, waitForSelector?: string, retries = 1): Promise<string> {
    console.log(`[BrowserManager] fetchHtml called for URL: ${url}`);
    await this.init();
    
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    const proxyStr = proxyManager.getRawProxy();
    console.log(`[BrowserManager] Creating FRESH context. Proxy: ${proxyStr ? 'IPRoyal Active' : 'NONE'}`);
    
    // Створюємо НОВИЙ контекст для КОЖНОГО запиту. 
    // Це примусово закриває TCP-з'єднання і змушує IPRoyal видавати новий IP щоразу!
    const context = await this.browser.newContext({
      proxy: proxyStr ? { server: proxyStr } : undefined,
      viewport: { width: 1920, height: 1080 },
      userAgent: getRandomUserAgent(),
      ignoreHTTPSErrors: true,
      javaScriptEnabled: true,
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9,de-DE;q=0.8',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1'
      }
    });

    const page = await context.newPage();

    // Блокуємо сміття для прискорення (економить трафік на IPRoyal)
    await page.route('**/*', (route) => {
      const type = route.request().resourceType();
      if (['image', 'media', 'font', 'stylesheet'].includes(type)) {
        route.abort().catch(() => {});
      } else {
        route.continue().catch(() => {});
      }
    });

    try {
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
      });

      console.log(`[BrowserManager] Navigating to ${url}...`);
      // Використовуємо 'commit' замість 'domcontentloaded' - це в рази швидше для повільних проксі
      const response = await page.goto(url, { waitUntil: 'commit', timeout: 30000 });
      console.log(`[BrowserManager] Navigation commit. Status: ${response?.status()}`);

      if (waitForSelector) {
        console.log(`[BrowserManager] Waiting for selector: ${waitForSelector}`);
        await page.waitForSelector(waitForSelector, { state: 'attached', timeout: 10000 }).catch(() => {});
      } else {
        await page.waitForTimeout(2000 + Math.random() * 2000);
      }

      const html = await page.content();
      console.log(`[BrowserManager] Successfully fetched HTML. Length: ${html.length}`);
      return html;
    } catch (e: any) {
      console.error(`[BrowserManager] ERROR fetching ${url}:`, e.message);
      
      // АВТОРЕТРАЙ: Якщо попався мертвий IP, одразу беремо новий і повторюємо
      if (retries > 0) {
        console.log(`[BrowserManager] Dead proxy node detected. Retrying... (${retries} attempts left)`);
        await context.close().catch(() => {});
        return this.fetchHtml(url, waitForSelector, retries - 1);
      }
      throw e;
    } finally {
      console.log(`[BrowserManager] Closing context to force IP rotation`);
      await context.close().catch(() => {});
    }
  }

  async restart(): Promise<void> {
    await this.close();
  }

  async close(): Promise<void> {
    if (this.browser) { 
      await this.browser.close().catch(()=>{}); 
      this.browser = null; 
    }
  }
}

export const browserManager = new BrowserManager();