export const settings = {
  onlyNewProducts: false,
  testMode: false,
  sourceName: undefined,
};

function getRealSourceName(sourceName) {
  return settings.testMode ? `${sourceName}_test` : sourceName;
}

export const SOURCES = {
  XIAOMI: {
    originalName: "xiaomi",
    get name() {
      return getRealSourceName(this.originalName);
    },
  },

  SONY: {
    originalName: "sony",
    get name() {
      return getRealSourceName(this.originalName);
    },
  },

  CENTRAL_MANUALS: {
    originalName: "central-manuals",
    get name() {
      return getRealSourceName(this.originalName);
    },
  },

  INSTRUMART: {
    originalName: "instrumart",
    get name() {
      return getRealSourceName(this.originalName);
    },
  },
};

export const SOURCE_WITHOUT_PRODUCTS_MANUALS_DATASET = [SOURCES.XIAOMI];
export const SOURCE_WITH_NEED_JOIN_MANUAL_TITLES = [
  SOURCES.CENTRAL_MANUALS,
  SOURCES.INSTRUMART,
];
