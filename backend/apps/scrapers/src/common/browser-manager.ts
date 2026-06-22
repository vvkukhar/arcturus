import { chromium } from 'playwright-extra';
import { Browser } from 'playwright';
import stealth from 'puppeteer-extra-plugin-stealth';
import { proxyManager } from './proxy-manager';

// Підключаємо маскування під реального юзера
chromium.use(stealth());

export class BrowserManager {
  private browser: Browser | null = null;

  async init(): Promise<void> {
    if (!this.browser) {
      console.log('[BrowserManager] Launching new stealth chromium browser...');
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-blink-features=AutomationControlled'
        ],
      });
      console.log('[BrowserManager] Browser launched successfully');
    }
  }

  async fetchHtml(url: string, waitForSelector?: string, retries = 15): Promise<string> {
    console.log(`[BrowserManager] fetchHtml called for URL: ${url}. Retries left: ${retries}`);
    await this.init();
    
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    const proxyStr = proxyManager.getRawProxy();
    console.log(`[BrowserManager] Creating FRESH context. Proxy: ${proxyStr ? 'IPRoyal Active' : 'NONE'}`);
    
    let proxyConfig = undefined;
    if (proxyStr) {
      try {
        const proxyUrl = new URL(proxyStr);
        proxyConfig = {
          server: `${proxyUrl.protocol}//${proxyUrl.host}`,
          username: proxyUrl.username ? decodeURIComponent(proxyUrl.username) : undefined,
          password: proxyUrl.password ? decodeURIComponent(proxyUrl.password) : undefined,
        };
      } catch (e) {
        console.error('[BrowserManager] Failed to parse proxy string');
      }
    }

    // Створюємо максимально природний контекст без кривих кастомних заголовків
    const context = await this.browser.newContext({
      proxy: proxyConfig,
      viewport: { width: 1920, height: 1080 },
      ignoreHTTPSErrors: true,
      javaScriptEnabled: true,
      locale: 'de-DE',
      timezoneId: 'Europe/Berlin',
    });

    const page = await context.newPage();

    // Блокуємо сміття для прискорення завантаження та економії трафіку IPRoyal
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
      console.log(`[BrowserManager] Navigating to ${url}...`);
      const response = await page.goto(url, { waitUntil: 'commit', timeout: 30000 });
      console.log(`[BrowserManager] Navigation commit. Status: ${response?.status()}`);

      if (waitForSelector) {
        console.log(`[BrowserManager] Waiting for selector: ${waitForSelector}`);
        await page.waitForSelector(waitForSelector, { state: 'attached', timeout: 15000 }).catch(() => {});
      } else {
        await page.waitForTimeout(4000 + Math.random() * 2000);
      }

      const html = await page.content();
      console.log(`[BrowserManager] Successfully fetched HTML. Length: ${html.length}`);

      // Захист від капчі/заглушки (якщо менше 5 КБ — це явно блок)
      if (html.length < 5000) {
        throw new Error(`Page too small (${html.length} bytes), likely a CAPTCHA or block page.`);
      }

      const lowerHtml = html.toLowerCase();
      if (lowerHtml.includes('security challenge') || lowerHtml.includes('verify you are human')) {
        throw new Error('CAPTCHA keyword detected in HTML.');
      }

      return html;
    } catch (e: any) {
      console.error(`[BrowserManager] ERROR fetching ${url}:`, e.message);
      
      if (retries > 0) {
        console.log(`[BrowserManager] Proxy blocked/failed. Retrying with new IP... (${retries - 1} attempts left)`);
        await context.close().catch(() => {});
        // Робимо паузу перед наступною спробою
        await new Promise(res => setTimeout(res, 1500));
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