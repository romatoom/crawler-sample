import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

const SOURCE = {
  KEY: "HYUNDAI_USA",

  BRAND: "Hyundai",

  ORIGINAL_NAME: "hyundaiusa",
  BASE_URL: "https://owners.hyundaiusa.com",

  LABELS: {
    MANUALS: "MANUALS",
  },

  METHODS: {
    joinTitles: BASE_MANUAL_TITLE_JOINER,
  },

  MANUAL_TYPES: [
    "Abridged Manual",
    "Owner's Manual",
    "Owners Manual",
    "User's Manual",
    "Quick Reference Guide",
    "Owners Handbook And Warranty Information",
    "Owner's Handbook & Warranty Information",
    "Getting Started Guide",
    "Quick Start Guide",
    "Quick Tips Manual",
  ],
};

export default SOURCE;
