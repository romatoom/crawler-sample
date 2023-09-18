import fs from "fs";

export const settings = {
  onlyNewProducts: false,
  testMode: false,
  source: {},
};

export async function getSourceByName(sourceName) {
  const { default: source } = await import(
    `#sources/${sourceName}/constants.js`
  );

  return source;
}

export function setSettings(newSettings) {
  for (const [key, value] of Object.entries(newSettings)) {
    settings[key] = value;
  }

  Object.defineProperty(settings.source, "currentName", {
    get: function () {
      return settings.testMode
        ? `${this.ORIGINAL_NAME}_test`
        : this.ORIGINAL_NAME;
    },
  });
}

// Список папок с ресурсами
export const sourceNames = fs
  .readdirSync("src/sources", { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

export const SOURCE_WITHOUT_PRODUCTS_MANUALS_DATASET = ["XIAOMI"];

export const SOURCES_WITH_NEED_REPLACE_URL = ["GOPRO"];
