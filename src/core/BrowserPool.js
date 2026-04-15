import { chromium, firefox } from 'patchright';
import { browserConfig } from '../browserConfig.js';
import logger from '../utils/logger.js';

class BrowserPool {
    constructor(options) {
        this.browserType = options.browser_type;
        this.headless = options.headless;
        this.threadCount = options.thread;
        this.useRandomConfig = options.random;
        this.browserName = options.browser;
        this.browserVersion = options.version;
        this.useragent = options.useragent;
        this.sec_ch_ua = "";
        this.debug = options.debug;
        this.maxTasks = options.max_tasks || 50;
        
        this.pool = [];
    }

    async initialize() {
        const browserConfigs = [];
        for (let i = 0; i < this.threadCount; i++) {
            let bName, bVer, ua, secChUa;
            
            if (['chromium', 'chrome', 'msedge'].includes(this.browserType)) {
                if (this.useRandomConfig) {
                    [bName, bVer, ua, secChUa] = browserConfig.getRandomBrowserConfig(this.browserType);
                } else if (this.browserName && this.browserVersion) {
                    const c = browserConfig.getBrowserConfig(this.browserName, this.browserVersion);
                    if (c) {
                        [ua, secChUa] = c;
                        bName = this.browserName;
                        bVer = this.browserVersion;
                    } else {
                        [bName, bVer, ua, secChUa] = browserConfig.getRandomBrowserConfig(this.browserType);
                    }
                } else {
                    if (this.useragent) {
                        bName = this.browserName || 'custom';
                        bVer = this.browserVersion || 'custom';
                        ua = this.useragent;
                        secChUa = this.sec_ch_ua || '';
                    } else {
                        [bName, bVer, ua, secChUa] = browserConfig.getRandomBrowserConfig(this.browserType);
                    }
                }
            } else {
                bName = this.browserType;
                bVer = 'custom';
                ua = this.useragent;
                secChUa = this.sec_ch_ua || '';
            }
            
            browserConfigs.push({ browser_name: bName, browser_version: bVer, useragent: ua, sec_ch_ua: secChUa });
        }

        const engine = this.browserType === 'camoufox' || this.browserType === 'firefox' ? firefox : chromium;

        for (let i = 0; i < this.threadCount; i++) {
            const config = browserConfigs[i];
            const browserArgs = [];
            if (config.useragent) browserArgs.push(`--user-agent=${config.useragent}`);
            
            const launchOptions = {
                headless: this.headless,
                args: browserArgs
            };
            if (['chrome', 'msedge'].includes(this.browserType)) {
                launchOptions.channel = this.browserType;
            }
            
            const browserInstance = await engine.launch(launchOptions);

            this.pool.push({
                index: i + 1,
                browser: browserInstance,
                config: config,
                tasksCount: 0,
                busy: false
            });

            if (this.debug) {
                logger.info(`Browser ${i + 1} initialized successfully with ${config.browser_name} ${config.browser_version}`);
            }
        }

        logger.info(`Browser pool initialized with ${this.pool.length} browsers`);
    }

    async getAvailableBrowser() {
        return new Promise(resolve => {
            const check = () => {
                const item = this.pool.find(b => !b.busy);
                if (item) {
                    item.busy = true;
                    resolve(item);
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    async releaseBrowser(item) {
        if (!item) return;
        if (item.tasksCount >= this.maxTasks) {
            item.busy = true;
            await this.restartBrowser(item);
        }
        item.busy = false;
    }

    async restartBrowser(item) {
        if (!item) return;
        const index = item.index;
        const config = item.config;
        
        try {
            logger.info(`Recycling Browser ${index}: Reached task limit (${this.maxTasks})`);
            await item.browser.close().catch(() => {});
            
            const engine = this.browserType === 'camoufox' || this.browserType === 'firefox' ? firefox : chromium;
            const browserArgs = [];
            if (config.useragent) browserArgs.push(`--user-agent=${config.useragent}`);
            
            const launchOptions = {
                headless: this.headless,
                args: browserArgs
            };
            if (['chrome', 'msedge'].includes(this.browserType)) {
                launchOptions.channel = this.browserType;
            }
            
            item.browser = await engine.launch(launchOptions);
            item.tasksCount = 0;
            logger.success(`Browser ${index} recycled and ready for new tasks.`);
        } catch (e) {
            logger.error(`Failed to recycle Browser ${index}: ${e.message}`);
        }
    }
}

export default BrowserPool;
