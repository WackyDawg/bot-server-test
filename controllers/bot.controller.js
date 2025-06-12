import { connect } from "puppeteer-real-browser";
import { newInjectedPage } from "fingerprint-injector";
import { loadCookies } from "../utils/cookieManager.js";

const bots = new Map();

export async function launchBot(config) {
  const cookies = await loadCookies(config.cookiePath);
  console.log("Configs",config)

  const { browser } = await connect({
    args: [
      `--proxy-server=socks5://127.0.0.1:9050`,
      "--disable-features=site-per-process",
      "--disable-blink-features=AutomationControlled",
      "--disable-infobars",
      "--disable-web-security",
      "--webrtc-ip-handling-policy=disable_non_proxied_udp",
      "--force-webrtc-ip-handling-policy",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--ignore-certificate-errors",
      "--ignore-certificate-errors-spki-list",
      "--disable-gpu",
      "--disable-infobars",
      "--window-position=0,0",
      "--ignore-certifcate-errors",
      "--ignore-certifcate-errors-spki-list",
      "--disable-speech-api",
      //"--disable-background-networking", // Disable several subsystems which run network requests in the background. This is for use 									  // when doing network performance testing to avoid noise in the measurements. ↪
      //"--disable-background-timer-throttling", // Disable task throttling of timer tasks from background pages. ↪
      "--disable-backgrounding-occluded-windows",
      "--disable-breakpad",
      "--disable-client-side-phishing-detection",
      "--disable-component-update",
      "--disable-default-apps",
      "--disable-dev-shm-usage",
      "--disable-domain-reliability",
      "--disable-extensions",
      "--disable-features=AudioServiceOutOfProcess",
      "--disable-hang-monitor",
      "--disable-ipc-flooding-protection",
      "--disable-notifications",
      "--disable-offer-store-unmasked-wallet-cards",
      "--disable-popup-blocking",
      "--disable-print-preview",
      "--disable-prompt-on-repost",
      "--disable-renderer-backgrounding",
      "--disable-setuid-sandbox",
      "--disable-sync",
      "--hide-scrollbars",
      "--ignore-gpu-blacklist",
      "--metrics-recording-only",
      "--mute-audio",
      "--no-default-browser-check",
      "--no-first-run",
      "--no-pings",
      "--no-zygote",
      "--password-store=basic",
      "--use-gl=swiftshader",
      "--use-mock-keychain",
    ],
    headless: true,
    turnstile: true,
  });

  const page = await newInjectedPage(browser, {
    fingerprintOptions: {
      devices: [config.profile],
      operatingSystems: [config.os],
    },
  });

  if (cookies.length) await page.setCookie(...cookies);

  await page.goto(config.startUrl, { waitUntil: "networkidle2", timeout: 0 });
  bots.set(config.botId, { page, browser });

  return { page, browser };
}

export function getBot(botId) {
  return bots.get(botId);
}

export function getAllBots() {
  return bots;
}
