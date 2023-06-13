import { log } from "crawlee";
import startMi from "#sources/mi/index.js";
import startCentralManuals from "#sources/central-manuals/index.js";

const sourceName = process.argv[2];

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
    default:
      log.warning(`Не найдено скрапера для "${sourceName}"`);
  }
} catch (err) {
  log.error(err);
}
