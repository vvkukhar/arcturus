// C:\Users\Vlad\lego_trading_manager\backend\apps\scrapers\src\common\browser-manager.ts

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
    console.log('[BrowserManager] init() called');
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
          '--window-size=1920,1080'
        ],
      });
      console.log('[BrowserManager] Browser launched successfully');
    }
    if (!this.context) {
      const proxyStr = proxyManager.getRawProxy();
      console.log(`[BrowserManager] Creating context. Proxy: ${proxyStr || 'NONE'}`);
      this.context = await this.browser.newContext({
        proxy: proxyStr ? { server: proxyStr } : undefined,
        viewport: { width: 1920, height: 1080 },
        userAgent: getRandomUserAgent(),
        ignoreHTTPSErrors: true,
        javaScriptEnabled: true,
      });
      console.log('[BrowserManager] Context created successfully');
    }
  }

  async fetchHtml(url: string, waitForSelector?: string): Promise<string> {
    console.log(`[BrowserManager] fetchHtml called for URL: ${url}`);
    await this.init();
    
    if (!this.context) {
      console.error('[BrowserManager] Context is null after init!');
      throw new Error('Browser not initialized');
    }

    console.log(`[BrowserManager] Opening new page...`);
    const page = await this.context.newPage();
    console.log(`[BrowserManager] New page created for ${url}`);

    try {
      console.log(`[BrowserManager] Navigating to ${url}...`);
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      console.log(`[BrowserManager] Navigation complete. Status: ${response?.status()}`);

      if (waitForSelector) {
        console.log(`[BrowserManager] Waiting for selector: ${waitForSelector}`);
        await page.waitForSelector(waitForSelector, { state: 'attached', timeout: 15000 }).catch(e => {
          console.error(`[BrowserManager] Selector ${waitForSelector} timeout:`, e.message);
        });
      } else {
        console.log(`[BrowserManager] Waiting standard delay...`);
        await page.waitForTimeout(4000 + Math.random() * 2000);
      }

      const html = await page.content();
      console.log(`[BrowserManager] Successfully fetched HTML. Length: ${html.length}`);
      return html;
    } catch (e: any) {
      console.error(`[BrowserManager] ERROR fetching ${url}:`, e.message);
      throw e;
    } finally {
      console.log(`[BrowserManager] Closing page for ${url}`);
      await page.close().catch(() => {});
    }
  }

  async restart(): Promise<void> {
    console.log('[BrowserManager] Restarting browser...');
    await this.close();
  }

  async close(): Promise<void> {
    console.log('[BrowserManager] Closing browser and context...');
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