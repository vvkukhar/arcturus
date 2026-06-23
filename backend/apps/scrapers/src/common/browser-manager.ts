import { chromium } from 'playwright-extra';
import { Browser } from 'playwright';
import stealth from 'puppeteer-extra-plugin-stealth';
import { proxyManager } from './proxy-manager';

// Stealth-плагін ховає той факт, що це автоматизований браузер
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
          '--disable-blink-features=AutomationControlled',
          '--window-size=1920,1080'
        ],
      });
      console.log('[BrowserManager] Browser launched successfully');
    }
  }

  async fetchHtml(url: string, waitForSelector?: string, retries = 10): Promise<string> {
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

    // Створюємо чистий контекст. Жодних кастомних заголовків!
    // Тільки зафіксований User-Agent під версію Chromium 124 (яка у нас в Docker)
    const context = await this.browser.newContext({
      proxy: proxyConfig,
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      ignoreHTTPSErrors: true,
      javaScriptEnabled: true,
      locale: 'de-DE',
      timezoneId: 'Europe/Berlin',
    });

    const page = await context.newPage();

    // Блокуємо ТІЛЬКИ картинки та відео для економії трафіку IPRoyal.
    // Стилі і скрипти не чіпаємо, щоб не тригерити захист Akamai на eBay.
    await page.route('**/*', (route) => {
      const type = route.request().resourceType();
      if (['image', 'media'].includes(type)) {
        route.abort('aborted').catch(() => {});
      } else {
        route.continue().catch(() => {});
      }
    });

    try {
      console.log(`[BrowserManager] Navigating to ${url}...`);
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      console.log(`[BrowserManager] Navigation commit. Status: ${response?.status()}`);

      // Якщо це eBay і ми отримали 403 Forbidden відразу на рівні HTTP — це бан IP
      if (response?.status() === 403 || response?.status() === 401) {
         throw new Error(`Access Denied by Server (HTTP ${response.status()})`);
      }

      if (waitForSelector) {
        console.log(`[BrowserManager] Waiting for selector: ${waitForSelector}`);
        await page.waitForSelector(waitForSelector, { state: 'attached', timeout: 15000 }).catch(() => {});
      } else {
        await page.waitForTimeout(3000 + Math.random() * 2000);
      }

      const html = await page.content();
      console.log(`[BrowserManager] Successfully fetched HTML. Length: ${html.length}`);

      // Захист від сторінок-капч. Капчі зазвичай важать менше 10 КБ.
      if (html.length < 10000) {
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
        // Робимо невелику паузу, щоб IPRoyal встиг перекинути нас на новий вузол
        await new Promise(res => setTimeout(res, 2000));
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