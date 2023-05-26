import { log } from "crawlee";
import startMi from "#sources/mi/index.js";

const sourceName = process.argv[2];

try {
  switch (sourceName) {
    case "mi":
      await startMi();
      break;
    default:
      log.warning(`Не найдено скрапера для "${sourceName}"`);
  }
} catch (err) {
  log.error(err);
}
