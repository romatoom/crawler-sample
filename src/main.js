import { log } from "crawlee";
import startMi from "#sources/mi/index.js";

const sources = process.argv[2]?.split(",");

const actions = [];

for (const source of sources) {
  switch (source) {
    case "mi":
      actions.push(startMi());
      break;
    default:
      log.warning(`Не найдено скрапера для "${source}"`);
  }
}

try {
  await Promise.all(actions);
} catch (err) {
  log.error(err);
}
