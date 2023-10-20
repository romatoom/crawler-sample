import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

const SOURCE = {
  KEY: "REDMOND",

  ORIGINAL_NAME: "redmond",
  BASE_URL: "https://redmond.company",
  STORE_URL: "https://store.redmond.company",
  BRAND: "Redmond",

  LABELS: {
    CATEGORIES: "CATEGORIES",
    PRODUCTS: "PRODUCTS",
    PRODUCT: "PRODUCT",

    STORY_CATEGORIES: "STORY_CATEGORIES",
    STORY_PRODUCTS: "STORY_PRODUCTS",
    STORY_PRODUCT: "STORY_PRODUCT",
  },

  METHODS: {
    joinTitles: BASE_MANUAL_TITLE_JOINER,
  },
};

export default SOURCE;
