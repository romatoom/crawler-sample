import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

const SOURCE = {
  KEY: "THERMOSTAT",

  ORIGINAL_NAME: "thermostat",
  BASE_URL: "https://thermostat.guide",

  LABELS: {
    BRANDS: "BRANDS",
    PRODUCTS: "PRODUCTS",
    PRODUCT: "PRODUCT",
  },

  METHODS: {
    joinTitles: BASE_MANUAL_TITLE_JOINER,
  },

  MANUALS_TYPES: [
    "Comprehensive Compatibility Chart",
    "User Manual",
    "USERS GUIDE",
    "Operating Instructions",
    "Wiring guide",
    "INSTALLATION INSTRUCTIONS",
    "Installation Instructions",
    "Comprehensive Quick Guide",
    "Troubleshoot Guide",
    "Instruction Manual",
    "Operation Manual",
    "Instruction Manuals",
    "INSTRUCTION GUIDE",
    "Installation Instruction",
    "WIRING DIAGRAM",
    "Operation Manuals",
    "Installation Guide",
    "Installation and Operating Instructions",
    "Technical Information",
  ],
};

export default SOURCE;
