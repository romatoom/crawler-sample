import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

const SOURCE = {
  KEY: "MBUSA",

  BRAND: "Mercedes-Benz",

  ORIGINAL_NAME: "mbusa",
  BASE_URL: "https://www.mbusa.com",
  MANUALS_BASE_URL: "https://www.mercedes-benz.co.uk",

  LABELS: {
    MANUALS: "MANUALS",
    VEHICLES: "VEHICLES",
    SPECS: "SPECS",

    MANUALS_DOUBLE: "MANUALS_DOUBLE",
  },

  METHODS: {
    referenceExist: (product, manual) => {
      const productSeries = product.metadata.series.toUpperCase();
      const manualSeries = manual.metadata.series.toUpperCase();

      const seriesEquals = productSeries === manualSeries;

      return seriesEquals;
    },

    pseudoProductForManual: (manual) => ({
      brand: SOURCE.BRAND,
      category: "Vehicles",
      name: manual.metadata.series,
      url: null,
      specs: [],
      images: [],
      metadata: {},
    }),

    joinTitles: BASE_MANUAL_TITLE_JOINER,
  },
};

export default SOURCE;
