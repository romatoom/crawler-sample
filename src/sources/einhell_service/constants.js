import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

const SOURCE = {
  KEY: "EINHELL_SERVICE",

  ORIGINAL_NAME: "einhell-service",
  BASE_URL: "https://www.einhell-service.com",

  LABELS: {
    CATEGORIES: "CATEGORIES",
    PRODUCTS_LIST: "PRODUCTS_LIST",
    PRODUCT: "PRODUCT",
  },

  FORMATTERS: {
    joinTitles: BASE_MANUAL_TITLE_JOINER,
  },
};

export default SOURCE;
