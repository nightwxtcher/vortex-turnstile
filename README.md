# 🌪️ Vortex-Turnstile Solver [v2.0 PRO]

![Vortex Banner](https://img.shields.io/badge/Version-2.0_PRO-blueviolet?style=for-the-badge)
![Patchright](https://img.shields.io/badge/Engine-Patchright-cyan?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Ultra_Stealth-green?style=for-the-badge)

A high-performance, modular Node.js service designed to bypass Cloudflare Turnstile with **zero detection** in headless mode. Refactored for maximum stability, security, and professional integration.

---

## 🚀 Key Features

- **🛡️ Ultra-Stealth Engine**: Powered by **Patchright**, implemented with Python-parity logic for perfect fingerprinting in headless mode.
- **🏗️ Modular Architecture**: Clean, enterprise-ready separation of concerns (Core, Services, Routes, Utils).
- **♻️ Auto-Healing Pool**: Built-in recycling system that restarts browser instances after $N$ tasks to ensure zero memory degradation.
- **🔒 Security First**: Middleware authentication via `x-api-key` and full support for `HTTP/S` and `JSON POST` requests.
- **📡 Intelligent Proxying**: Automatic transformation of SOCKS5 to high-privacy protocols and remote DNS resolution.
- **📊 Verbose Debugging**: Real-time monitoring of proxy usage, navigation attempts, and click strategies.

---

## 🛠️ Installation

1. **Clone & Install**:
   ```bash
   git clone https://github.com/nightwxtcher/vortex-turnstile.git
   cd vortex-turnstile
   npm install
   ```

2. **Deploy Engine**:
   ```bash
   npx patchright install chromium
   ```

3. **Configure Proxies**:
   Add your proxies to `proxies.txt` (Format: `protocol://user:pass@ip:port` or `ip:port`).

---

## ⚙️ Core Configuration

Start the Vortex engine with the following flags to optimize for your environment:

| Flag | Description | Recommendation |
|------|-------------|----------------|
| `--port` | Service port | `5072` |
| `--thread` | Browser instances | `4+` |
| `--max_tasks` | Auto-recycle limit | `50` |
| `--api_key` | Enable authentication | `true` |
| `--proxy` | Rotate proxies | `true` |
| `--debug` | Verbose logging | `true` |
| `--browser_type` | Engine selector | `chrome` (System) |

---

## 📖 API Documentation

### 1. Execute Task
**Endpoint**: `POST /turnstile`
**Headers**: `x-api-key: YOUR_KEY`

```json
{
  "url": "https://target-site.com",
  "sitekey": "0x4AAAAAA...",
  "action": "login"
}
```

### 2. Retrieve Result
**Endpoint**: `GET /result?id=TASK_ID`

---

## 👤 Maintainer

**Refactored with passion by NightWxtcher**

- **Telegram**: [@NightWxtcher](https://t.me/NightWxtcher)
- **GitHub**: [nightwxtcher](https://github.com/nightwxtcher)

---

> [!IMPORTANT]
> **Vortex-Turnstile** is optimized for high-volume bypass. To maintain maximum stealth, it is recommended to use **Residentials Proxies** and the `--browser_type chrome` flag to utilize system-level browser signatures.

---
© 2026 Vortex Solver. All Rights Reserved.
