import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

const CASIO = {
  KEY: "CASIO",

  BRAND: "CASIO",

  ORIGINAL_NAME: "casio",
  SUPPORT_URL: "https://world.casio.com/support/manual",

  LABELS: {
    SUPPORT_PRODUCTS: "SUPPORT_PRODUCTS",
    SUPPORT_MANUALS: "SUPPORT_MANUALS",
    PRODUCT: "PRODUCT",
  },

  METHODS: {
    joinTitles: BASE_MANUAL_TITLE_JOINER,
    getSeparateNames: (name) => {
      const firstBracketIndex = name.indexOf("(");
      const clearedName =
        firstBracketIndex === -1 ? name : name.slice(0, firstBracketIndex);
      return clearedName.split(",").map((n) => n.trim());
    },
  },

  LANGS: {
    en: "English",
    fr: "Français",
    es: "Español",
    pt: "Português",
    de: "Deutsch",
    it: "Italiano",
    no: "Norsk",
    ru: "Русский",
    sv: "Svenska",
    tr: "Türkçe",
    ar: "عرب",
    cn: "中國人",
    ko: "코레이스키",
    th: "แบบไทย",
    vi: "Tiếng Việt",
  },

  CIDS: {
    "008": "Electronic Musical Instruments",
    "001": "Digital Cameras",
    "003": "Electronic Dictionaries",
    "004": "Calculators",
    "010": "Handheld Terminals",
    "007": "Projectors",
    "033": "Medical Devices",
    "006": "Cash Registers",
    "005": "Label Printers",
    "013": "Digital Diary",
  },
};

export default CASIO;
