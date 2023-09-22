const CENTRAL_MANUALS = {
  KEY: "CENTRAL_MANUALS",

  ORIGINAL_NAME: "central-manuals",

  BASE_URL: {
    EN: "https://www.central-manuals.com",
    FR: "https://www.central-manuels.com",
    ES: "https://www.central-manuales.com",
  },

  LABELS: {
    START: "START",
    CATEGORY: "CATEGORY",
    MANUALS: "MANUALS",
  },

  METHODS: {
    infoByManualTitle: (title, langCode = "EN") => {
      const MANUAL_TYPE_MAX_LENGTH = 60;

      const manualTitleParts = title.split(" - ").map((el) => el.trim());
      let manualType = manualTitleParts[manualTitleParts.length - 1].trim();

      manualType = manualType.replaceAll("’", "'");

      switch (langCode) {
        case "EN":
          manualType = manualType.includes("U.M.") ? "User Manual" : manualType;
          break;
        case "FR":
          manualType = manualType.includes("M.E.") ? "User Manual" : "Manual";
          break;
        case "ES":
          manualType = manualType.includes("M.U.") ? "User Manual" : "Manual";
          break;
      }

      if (manualType.length >= MANUAL_TYPE_MAX_LENGTH) manualType = "Manual";

      const productName = manualTitleParts
        .slice(0, manualTitleParts.length - 1)
        .join(" - ")
        .trim();

      return { productName, manualType };
    },

    joinTitles: (titles) => {
      const titleInfo = titles.map((title) => {
        return METHODS.infoByManualTitle(title);
      });

      const productNames = [...new Set(titleInfo.map((el) => el.productName))];
      const manualTypes = [...new Set(titleInfo.map((el) => el.manualType))];

      return `${productNames.join(" / ")} - ${manualTypes.join(" / ")}`;
    },
  },
};

export default CENTRAL_MANUALS;
