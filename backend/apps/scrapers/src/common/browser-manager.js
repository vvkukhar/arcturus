"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.browserManager = exports.BrowserManager = void 0;
const playwright_extra_1 = require("playwright-extra");
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const proxy_manager_1 = require("./proxy-manager");
playwright_extra_1.chromium.use((0, puppeteer_extra_plugin_stealth_1.default)());
class BrowserManager {
    constructor() {
        this.browser = null;
    }
    async init() {
        if (!this.browser) {
            this.browser = await playwright_extra_1.chromium.launch({
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
    async fetchHtml(url) {
        await this.init();
        const proxyStr = proxy_manager_1.proxyManager.getRawProxy();
        const proxyConfig = proxyStr ? { server: proxyStr } : undefined;
        const context = await this.browser.newContext({
            proxy: proxyConfig,
            viewport: { width: 1920, height: 1080 },
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        });
        const page = await context.newPage();
        await page.route('**/*', (route) => {
            const type = route.request().resourceType();
            if (['image', 'media', 'font', 'stylesheet'].includes(type)) {
                route.abort();
            }
            else {
                route.continue();
            }
        });
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
            await page.waitForTimeout(Math.random() * 2000 + 1500);
            return await page.content();
        }
        finally {
            await context.close();
        }
    }
    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}
exports.BrowserManager = BrowserManager;
exports.browserManager = new BrowserManager();
