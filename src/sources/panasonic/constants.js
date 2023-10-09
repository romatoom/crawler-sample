import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

const SOURCE = {
  KEY: "PANASONIC",

  BRAND: "Panasonic",

  ORIGINAL_NAME: "panasonic",
  BASE_URL: "https://shop.panasonic.com",
  HELP_URL: "https://help.na.panasonic.com",

  LABELS: {
    PRODUCTS: "PRODUCTS",
    PRODUCT: "PRODUCT",
    MANUALS: "MANUALS",
  },

  METHODS: {
    joinTitles: BASE_MANUAL_TITLE_JOINER,
  },

  MANUAL_TYPES: [
    "Quick Start Guide",
    "Quick Service Guide",
    "Quick Setup Guide",
    "Connection Guide",
    "Quick Guide",
    "Setup Guide",
    "Installation Guide",
    "Guide",
    "Operating Instructions & Recipies",
    "Operating Instructions",
    "Important Information",
    "Information",
    "Quick Start",
    "Installation Manual",
    "Owner's Manual",
    "Safety Information",
    "Basic Owners Manual",
    "Instruction",
    "Notice",
    "Basic Usage",
    "Basic Manual",
    "User Manual",
  ],
};

export default SOURCE;
