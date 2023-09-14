import { log } from "crawlee";

import { SOURCES } from "#utils/globals.js";

import startXiaomi from "#sources/xiaomi/index.js";
import startCentralManuals from "#sources/central-manuals/index.js";
import startSony from "#sources/sony/index.js";
import startInstrumart from "#sources/instrumart/index.js";
// import startManualowl from "#sources/manualowl/index.js";
import startGoPro from "#sources/gopro/index.js";
import startCitizenwatch from "#sources/citizenwatch/index.js";
import startDns from "#sources/dns/index.js";
import startMsi from "#sources/msi/index.js";
import startWhirlpool from "#sources/whirlpool/index.js";
import startCanon from "#sources/canon/index.js";
import startPolaris from "#sources/polaris/index.js";
import startCasio from "#sources/casio/index.js";

import { settings } from "#utils/globals.js";

const sourceName = process.argv[2];

settings.onlyNewProducts = process.argv.includes("only-new-products");
settings.testMode = process.argv.includes("test-mode");

const source = Object.entries(SOURCES).find(
  (s) => s[1].ORIGINAL_NAME === sourceName
);

if (!source) {
  log.error(`Не найдено скрапера для "${sourceName}"`);
  process.exit();
}

settings.source = SOURCES[source[0]];

try {
  switch (settings.source) {
    case SOURCES.XIAOMI:
      await startXiaomi();
      break;

    /* case "manualslib":
      await startManualsLib();
      break; */

    case SOURCES.CENTRAL_MANUALS:
      await startCentralManuals();
      break;

    case SOURCES.SONY:
      await startSony();
      break;

    case SOURCES.INSTRUMART:
      await startInstrumart();
      break;

    /* case SOURCES.MANUALOWL:
      await startManualowl();
      break; */

    case SOURCES.GOPRO:
      await startGoPro();
      break;

    case SOURCES.CITIZENWATCH:
      await startCitizenwatch();
      break;

    case SOURCES.DNS:
      await startDns();
      break;

    case SOURCES.MSI:
      await startMsi();
      break;

    case SOURCES.WHIRLPOOL:
      await startWhirlpool();
      break;

    case SOURCES.CANON:
      await startCanon();
      break;

    case SOURCES.POLARIS:
      await startPolaris();
      break;

    case SOURCES.CASIO:
      await startCasio();
      break;

    default:
      log.error(`Не найдено скрапера для "${sourceName}"`);
      process.exit();
  }
} catch (err) {
  log.error(err);
}
