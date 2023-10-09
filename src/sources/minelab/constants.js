import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

const SOURCE = {
  KEY: "MINELAB",

  BRAND: "Minelab",

  ORIGINAL_NAME: "minelab",
  BASE_URL: "https://www.minelab.com",

  LABELS: {
    /*PRODUCTS: "PRODUCTS",
    PRODUCT: "PRODUCT",
    GO_FIND_PRODUCTS: "GO_FIND_PRODUCTS",
    GO_FIND_PRODUCT: "GO_FIND_PRODUCT",*/
    MANUALS: "MANUALS",
  },

  METHODS: {
    pseudoProductForManual: (manual) => ({
      brand: SOURCE.BRAND,
      category: "Metal detectors",
      name: null,
      url: null,
      specs: [],
      images: [],
      metadata: {},
    }),

    joinTitles: BASE_MANUAL_TITLE_JOINER,
  },

  LANGUAGES: [
    "EN",
    "ES",
    "PT",
    "FR",
    "RU",
    "AR",
    "ZH",
    "MN",
    "PL",
    "SW",
    "ID",
    "MY",
    "TH",
    "JP",
    "DE",
    "IT",
    "TR",
    "JA",
    "CS",
    "KO",
    "HI",
    "KR",
    "MS",
    "CZ",
    "HU",
    "NL",
    "CA",
    "TL",
    "VI",
    "HR",
    "KU",
  ],
};

export default SOURCE;
