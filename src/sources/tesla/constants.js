import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

const SOURCE = {
  KEY: "TESLA",

  ORIGINAL_NAME: "tesla",
  BASE_URL: "https://www.tesla.com",
  BRAND: "Tesla",

  LABELS: {
    PRODUCTS: "PRODUCTS",
    MANUALS: "MANUALS",
    DOWNLOAD: "DOWNLOAD",
  },

  METHODS: {
    joinTitles: BASE_MANUAL_TITLE_JOINER,
  },
};

export default SOURCE;
