const XIAOMI = {
  KEY: "XIAOMI",

  ORIGINAL_NAME: "xiaomi",
  BASE_URL: "https://www.mi.com",
  BRAND: "Xiaomi",

  LABELS: {
    START_USER_GUIDES: "START_USER_GUIDES",
    USER_GUID: "USER_GUID",
    START_SITEMAP: "START_SITEMAP",
    PRODUCT: "PRODUCT",
    PRODUCT_SPECS: "PRODUCT_SPECS",
  },

  FORMATTERS: {
    cleanedManualTitle: (title) => {
      let regexp =
        /Generic User Guide for|Generic User Guide|General User Guide|User Guide|Safety Information|Quick Start Guide|Adapter Information|\(M2110E1\)|\(M2133E1\)/;

      let cleanedTitle = title.replace(regexp, "").trim();
      regexp = /\(3.5L\)/;
      return cleanedTitle.replace(regexp, "3.5L");
    },

    materialTypeByManualTitle: (title) => {
      let result = title.trim().toLowerCase();

      if (
        result.includes("generic user guide") ||
        result.includes("general user guide") ||
        result.includes("genel kullanım kılavuzu") ||
        result.includes("genel kullanıcı kılavuzu")
      ) {
        return "General User Guide";
      }

      if (result.includes("quick start guide")) {
        return "Quick Start Guide";
      }

      if (result.includes("user guide")) {
        return "User Guide";
      }

      if (
        result.includes("safety information") ||
        result.includes("güvenlik bilgileri")
      ) {
        return "Safety Information";
      }

      return "Manual";
    },
  },
};

export default XIAOMI;
