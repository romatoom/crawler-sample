import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

const SOURCE = {
  KEY: "HP",

  ORIGINAL_NAME: "hp",
  BASE_URL: "https://support.hp.com",
  BRAND: "HP",

  LABELS: {
    CATEGORY: "CATEGORY",
    SERIES: "SERIES",
  },

  METHODS: {
    joinTitles: BASE_MANUAL_TITLE_JOINER,
  },
};

export default SOURCE;
