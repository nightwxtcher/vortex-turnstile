export class BrowserConfig {
    static SEC_CH_UA_CONFIGS = {
        chrome: {
            "139": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
            "138": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
            "137": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
            "136": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\""
        },
        edge: {
            "139": "\"Not;A=Brand\";v=\"99\", \"Microsoft Edge\";v=\"139\", \"Chromium\";v=\"139\"",
            "138": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Microsoft Edge\";v=\"138\"",
            "137": "\"Microsoft Edge\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\""
        },
        avast: {
            "138": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Avast Secure Browser\";v=\"138\"",
            "137": "\"Avast Secure Browser\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\""
        },
        brave: {
            "139": "\"Not;A=Brand\";v=\"99\", \"Brave\";v=\"139\", \"Chromium\";v=\"139\"",
            "138": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Brave\";v=\"138\"",
            "137": "\"Brave\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\""
        }
    };

    static USER_AGENT_CONFIGS = {
        chrome: {
            "139": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
            "138": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
            "137": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
            "136": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
        },
        edge: {
            "139": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0",
            "138": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0",
            "137": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0"
        },
        avast: {
            "138": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Avast/138.0.0.0",
            "137": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Avast/137.0.0.0"
        },
        brave: {
            "139": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
            "138": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
            "137": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36"
        }
    };

    constructor() {
        this.availableBrowsers = Object.keys(BrowserConfig.USER_AGENT_CONFIGS);
    }

    getRandomBrowserConfig(browserType = null) {
        let browser;
        if (['chrome', 'chromium', 'msedge', 'avast'].includes(browserType)) {
            const chromiumBrowsers = ['chrome', 'edge', 'avast', 'brave'];
            browser = chromiumBrowsers[Math.floor(Math.random() * chromiumBrowsers.length)];
        } else if (browserType === 'camoufox') {
            return ['firefox', 'custom', '', ''];
        } else {
            browser = this.availableBrowsers[Math.floor(Math.random() * this.availableBrowsers.length)];
        }

        const versions = Object.keys(BrowserConfig.USER_AGENT_CONFIGS[browser]);
        const version = versions[Math.floor(Math.random() * versions.length)];
        
        const userAgent = BrowserConfig.USER_AGENT_CONFIGS[browser][version];
        let secChUa = "";
        
        if (BrowserConfig.SEC_CH_UA_CONFIGS[browser] && BrowserConfig.SEC_CH_UA_CONFIGS[browser][version]) {
            secChUa = BrowserConfig.SEC_CH_UA_CONFIGS[browser][version];
        }

        return [browser, version, userAgent, secChUa];
    }

    getBrowserConfig(browser, version) {
        try {
            const userAgent = BrowserConfig.USER_AGENT_CONFIGS[browser][version];
            if (!userAgent) return null;
            
            let secChUa = "";
            if (BrowserConfig.SEC_CH_UA_CONFIGS[browser] && BrowserConfig.SEC_CH_UA_CONFIGS[browser][version]) {
                secChUa = BrowserConfig.SEC_CH_UA_CONFIGS[browser][version];
            }
            return [userAgent, secChUa];
        } catch(e) {
            return null;
        }
    }
}

export const browserConfig = new BrowserConfig();
