import { log } from "crawlee";
import {
  sourceNames,
  newSourceNames,
  getSourceByName,
  setSettings,
} from "#utils/globals.js";

import state from "#utils/classes/state.js";

log.setLevel(log.LEVELS.DEBUG);

const INACTIVE_SOURSE_NAMES = ["manualowl", "manualslib", "ownersmanuals2"];

const sourceName = process.argv[2];

if (INACTIVE_SOURSE_NAMES.includes(sourceName)) {
  log.error(`Скрапер для "${sourceName}" отключён`);
  process.exit();
}

try {
  if (
    !newSourceNames.includes(sourceName) &&
    !sourceNames.includes(sourceName)
  ) {
    log.error(`Не найдено скрапера для "${sourceName}"`);
    process.exit();
  }

  if (newSourceNames.includes(sourceName)) {
    // Новые ресурсы
    const { default: SourceClass } = await import(
      `#sources/${sourceName}/${sourceName}.js`
    );

    const source = await new SourceClass().init();

    await state.init(source);

    await source.start();
  } else {
    // Старые ресурсы (легаси)
    setSettings({
      source: await getSourceByName(sourceName),
      onlyNewProducts: process.argv.includes("only-new-products"),
      testMode: process.argv.includes("test-mode"),
    });

    const { default: start } = await import(`#sources/${sourceName}/index.js`);

    await start();
  }
} catch (err) {
  log.error(err);
}
