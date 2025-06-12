import fs from "fs/promises";

export async function loadCookies(path) {
  try {
    const data = await fs.readFile(path, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveCookies(path, cookies) {
  await fs.writeFile(path, JSON.stringify(cookies, null, 2));
}
