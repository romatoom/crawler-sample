import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

const SOURCE = {
  KEY: "NIKON",

  ORIGINAL_NAME: "nikon",
  BASE_URL: "https://downloadcenter.nikonimglib.com",
  BRAND: "Nikon",

  LABELS: {
    MANUAL: "MANUAL",
    PRODUCT: "PRODUCT",
  },

  METHODS: {
    joinTitles: BASE_MANUAL_TITLE_JOINER,
  },
};

export default SOURCE;
