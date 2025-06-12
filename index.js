import fs from "fs/promises";
import dotenv from "dotenv";
import chalk from "chalk";
import { Client, GatewayIntentBits } from "discord.js";
import { launchBot, getBot } from "./controllers/bot.controller.js";
import onionProxy from "./onion-proxy/app.js";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(chalk.green(`🤖 Logged in as ${client.user.tag}`));
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const [cmd, botId, ...args] = message.content.trim().split(/\s+/);
  const bot = getBot(botId);
  if (!bot) return message.reply(`❌ Bot '${botId}' not found`);

  try {
    switch (cmd) {
      case "!goto":
        await bot.page.goto(args[0], { waitUntil: "networkidle2", timeout: 0 });
        return message.reply(`✅ ${botId} navigated to ${args[0]}`);

      case "!click":
        await bot.page.click(args[0]);
        return message.reply(`✅ ${botId} clicked ${args[0]}`);

      case "!screenshot":
        const screenshotPath = `screenshot-${botId}.png`;
        await bot.page.screenshot({ path: screenshotPath });
        return message.reply({ files: [screenshotPath] });

      case "!type":
        const selector = args[0];
        const text = args.slice(1).join(" ");
        await bot.page.type(selector, text);
        return message.reply(`✅ Typed in ${botId}`);

      default:
        return message.reply("❓ Unknown command.");
    }
  } catch (err) {
    console.error(err);
    return message.reply(`❌ Error: ${err.message}`);
  }
});

async function loadSingleBotFromEnv() {
    const config = {
        botId: process.env.BOT_ID || "default-bot",
        cookiePath: process.env.COOKIE_PATH || "./cookies/default2.json",
        profile: process.env.devices || "desktop",
        os: process.env.operatingSystems || "windows",
        proxy: process.env.PROXY || "socks5://127.0.0.1:9050",
        startUrl: process.env.START_URL || "https://ip-scan.browserscan.net/sys/config/ip/get-visitor-ip",
      };
      

  try {
    await launchBot(config);
    console.log(chalk.cyan(`✅ Launched bot: ${config.botId}`));
  } catch (err) {
    console.error(
      chalk.red(`❌ Failed to launch bot ${config.botId}: ${err.message}`)
    );
  }
}

async function start() {
  onionProxy.startTorProxy(async () => {
    try {
      await loadSingleBotFromEnv();
      const token = process.env.DISCORD_BOT_TOKEN.replace(/\+/g, "");
      await client.login(token);
    } catch (error) {
      console.error(chalk.red("❌ Startup failed:"), error);
      process.exit(1);
    }
  });
}

start();
