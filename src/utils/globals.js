import XIAOMI from "#sources/xiaomi/constants.js";
import CENTRAL_MANUALS from "#sources/central-manuals/constants.js";
import SONY from "#sources/sony/constants.js";
import INSTRUMART from "#sources/instrumart/constants.js";
// import MANUALOWL from "#sources/manualowl/constants.js";
import GOPRO from "#sources/gopro/constants.js";
import CITIZENWATCH from "#sources/citizenwatch/constants.js";
import DNS from "#sources/dns/constants.js";
import MSI from "#sources/msi/constants.js";

export const settings = {
  onlyNewProducts: false,
  testMode: false,
  source: {},
};

export const SOURCES = {
  XIAOMI,
  CENTRAL_MANUALS,
  SONY,
  INSTRUMART,
  // MANUALOWL,
  GOPRO,
  CITIZENWATCH,
  DNS,
  MSI,
};

for (const sourceKey of Object.keys(SOURCES)) {
  Object.defineProperty(SOURCES[sourceKey], "currentName", {
    get: function () {
      return settings.testMode
        ? `${this.ORIGINAL_NAME}_test`
        : this.ORIGINAL_NAME;
    },
  });
}

export const SOURCE_WITHOUT_PRODUCTS_MANUALS_DATASET = [SOURCES.XIAOMI];

export const SOURCE_WITH_NEED_JOIN_MANUAL_TITLES = [
  SOURCES.CENTRAL_MANUALS,
  SOURCES.INSTRUMART,
  SOURCES.CITIZENWATCH,
  SOURCES.MSI,
];

export const SOURCES_WITH_NEED_REPLACE_URL = [SOURCES.GOPRO];
