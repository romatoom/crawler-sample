import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

const SOURCE = {
  KEY: "TEST",

  ORIGINAL_NAME: "test",
  BASE_URL: "https://www.gourmia.com",
  BRAND: "Gourmia",

  LABELS: {
    PRODUCTS: "PRODUCTS",
    PRODUCT: "PRODUCT",
  },

  METHODS: {
    joinTitles: BASE_MANUAL_TITLE_JOINER,
  },
};

export default SOURCE;
