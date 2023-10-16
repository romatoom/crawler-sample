import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

const SOURCE = {
  KEY: "LEVOIT",

  ORIGINAL_NAME: "levoit",
  BASE_URL: "https://levoit.com",
  BRAND: "Levoit",

  LABELS: {
    PRODUCTS: "PRODUCTS",
    MANUALS: "MANUALS",
  },

  METHODS: {
    joinTitles: BASE_MANUAL_TITLE_JOINER,
  },
};

export default SOURCE;
