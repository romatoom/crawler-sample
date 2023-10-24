import { log } from "crawlee";
import { sourceNames, getSourceByName, setSettings } from "#utils/globals.js";

const INACTIVE_SOURSE_NAMES = ["manualowl", "manualslib", "ownersmanuals2"];

const sourceName = process.argv[2];

if (INACTIVE_SOURSE_NAMES.includes(sourceName)) {
  log.error(`Скрапер для "${sourceName}" отключён`);
  process.exit();
}

if (!sourceNames.includes(sourceName)) {
  log.error(`Не найдено скрапера для "${sourceName}"`);
  process.exit();
}

setSettings({
  source: await getSourceByName(sourceName),
  onlyNewProducts: process.argv.includes("only-new-products"),
  testMode: process.argv.includes("test-mode"),
});

const { default: start } = await import(`#sources/${sourceName}/index.js`);

try {
  await start();
} catch (err) {
  log.error(err);
}
