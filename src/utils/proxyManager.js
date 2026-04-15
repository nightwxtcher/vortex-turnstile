import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROXIES_FILE = path.join(__dirname, '..', '..', 'proxies.txt');

class ProxyManager {
    static getProxies(proxySupport = false) {
        if (!proxySupport) return null;
        try {
            if (fs.existsSync(PROXIES_FILE)) {
                const data = fs.readFileSync(PROXIES_FILE, 'utf8');
                const proxies = data.split('\n').map(p => p.trim()).filter(p => p.length > 0);
                if (proxies.length > 0) {
                    return proxies[Math.floor(Math.random() * proxies.length)];
                }
            }
        } catch (e) {
            logger.warn(`Error reading proxy file: ${e.message}`);
        }
        return null;
    }

    static parseProxyString(proxyStr) {
        if (!proxyStr) return undefined;
        try {
            if (proxyStr.includes('://')) {
                const url = new URL(proxyStr);
                return {
                    server: `${url.protocol}//${url.hostname}:${url.port}`,
                    username: url.username,
                    password: url.password
                };
            }
            
            const parts = proxyStr.split(':');
            
            if (parts.length === 2) {
                return { server: `http://${proxyStr}` };
            }
            if (parts.length === 3) {
                return { server: `${parts[0]}://${parts[1]}:${parts[2]}` };
            }
            if (parts.length === 4) {
                return { 
                    server: `http://${parts[0]}:${parts[1]}`,
                    username: parts[2],
                    password: parts[3]
                };
            }
            if (parts.length === 5) {
                return { 
                    server: `${parts[0]}://${parts[1]}:${parts[2]}`, 
                    username: parts[3], 
                    password: parts[4] 
                };
            }

            return { server: proxyStr };
        } catch(e) {
            logger.warn(`Failed to parse proxy: ${proxyStr}`);
        }
        return undefined;
    }
}

export default ProxyManager;
