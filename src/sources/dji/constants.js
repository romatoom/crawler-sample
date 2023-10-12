import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

const SOURCE = {
  KEY: "DJI",

  ORIGINAL_NAME: "dji",
  BASE_URL: "https://www.dji.com",
  BRAND: "DJI",

  LABELS: {
    PRODUCTS: "PRODUCTS",
    DOWNLOADS: "DOWNLOADS",
    MANUALS: "MANUALS",
    PRODUCT: "PRODUCT",
  },

  METHODS: {
    joinTitles: BASE_MANUAL_TITLE_JOINER,
  },

  MANUAL_TYPES: [
    "Release Notes",
    "User Manual",
    "Compatibility Information",
    "Disclaimer and Safety Guidelines",
    "Quick Start Guide",
    "User Guide",
    "Safety Guidelines",
    "Known Issue List",
    "In the Box",
    "Product Information",
    "Maintenance Manual",
    "Case Study",
    "Safety Guides",
    "Installation Guidelines",
    "Training Guide",
    "Attachment Instructions",
    "Installation Guide",
    "User Instructions",
    "Quick Start Manual",
    "Update Guide",
    "Compatibility List",
    "User Instruction",
    "Warranty Periods Information",
    "Operation Guide",
    "Instruction",
    "Guide",
  ],
};

export default SOURCE;
