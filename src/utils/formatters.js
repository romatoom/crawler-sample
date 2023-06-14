export function normalizeTitle(title) {
  let normalizedTitle = title.trim().toLowerCase();
  return normalizedTitle.charAt(0).toUpperCase() + normalizedTitle.slice(1);
}

export const MI_FORMATTERS = {
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
};

export const CENTRAL_MANUALS_FORMATTERS = {
  infoByManualTitle: (title) => {
    const MANUAL_TYPE_MAX_LENGTH = 60;

    const manualTitleParts = title.split(" - ").map((el) => el.trim());
    let manualType = manualTitleParts[manualTitleParts.length - 1].trim();

    manualType = manualType.replace("’", "'");
    manualType = manualType.replace("U.M.", "User Manual");

    if (manualType.length >= MANUAL_TYPE_MAX_LENGTH) manualType = "Manual";

    const productName = manualTitleParts
      .slice(0, manualTitleParts.length - 1)
      .join(" - ")
      .trim();

    return { productName, manualType };
  },

  joinTitles: (titles) => {
    const productNames = [
      ...new Set(
        titles.map((title) => {
          const { productName } =
            CENTRAL_MANUALS_FORMATTERS.infoByManualTitle(title);
          return productName;
        })
      ),
    ];

    const { manualType } = CENTRAL_MANUALS_FORMATTERS.infoByManualTitle(
      titles[0]
    );

    return `${productNames.join(" / ")} - ${manualType}`;
  },
};
