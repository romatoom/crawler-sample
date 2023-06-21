import { log } from "crawlee";
import startMi from "#sources/mi/index.js";
import startCentralManuals from "#sources/central-manuals/index.js";
import startSony from "#sources/sony/index.js";
import { settings } from "#utils/globals.js";

const sourceName = process.argv[2];
settings.onlyNewProducts = process.argv[3] === "only-new-products" || false;

try {
  switch (sourceName) {
    case "mi":
      await startMi();
      break;
    /* case "manualslib":
      await startManualsLib();
      break; */
    case "central-manuals":
      await startCentralManuals();
      break;
    case "sony":
      await startSony();
      break;
    default:
      log.warning(`Не найдено скрапера для "${sourceName}"`);
  }
} catch (err) {
  log.error(err);
}
