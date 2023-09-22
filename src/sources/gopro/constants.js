import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

const GOPRO = {
  KEY: "GOPRO",

  ORIGINAL_NAME: "gopro",
  BASE_URL: "https://gopro.com",
  BRAND: "GoPro",

  LABELS: {
    PRODUCTS_MANUALS: "PRODUCTS_MANUALS",
  },

  METHODS: {
    joinTitles: BASE_MANUAL_TITLE_JOINER,
  },

  urlsHash: {},
};

export default GOPRO;
