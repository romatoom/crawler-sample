import clone from "clone";

import startCase from "lodash/startCase.js";
import camelCase from "lodash/camelCase.js";

import LocaleCode from "locale-code";

export function normalizeTitle(title) {
  let normalizedTitle = title.trim().toLowerCase();
  return normalizedTitle.charAt(0).toUpperCase() + normalizedTitle.slice(1);
}

export function normalizeBrand(brand) {
  const brandLower = brand.toLowerCase();
  switch (brandLower) {
    case "i-joy":
      return "i-Joy";

    case "at&t":
      return "AT&T";

    case "t-mobile":
      return "T-Mobile";

    case "regula-werk":
    case "king":
      return "Regula-Werk King";

    case "tp-link":
    case "neffos":
      return "TP-Link Neffos";

    case "m-audio":
      return "Avid Technology";

    case "sim-wings":
      return "Aerosoft";

    case "asahi pentax":
    case "honeywell pentax":
      return "Asahi Pentax / Honeywell Pentax";

    case "barnes & noble":
      return "Barnes & Noble";

    case "hewlett-packard":
    case "hp":
      return "HP (Hewlett-Packard)";

    default:
      return startCase(camelCase(brand));
  }
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

export function getLanguagesByLocales(locales) {
  const languages = locales.map((l) => {
    const localeParts = l.split("_");

    if (localeParts.length === 2) {
      localeParts[1] = localeParts[1].toUpperCase();
    } else {
      localeParts.push(localeParts[0].toUpperCase());
    }

    const locale = localeParts.join("-");
    return LocaleCode.getLanguageName(locale);
  });

  return [...new Set(languages)];
}

export const CENTRAL_MANUALS_FORMATTERS = {
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
      return CENTRAL_MANUALS_FORMATTERS.infoByManualTitle(title);
    });

    const productNames = [...new Set(titleInfo.map((el) => el.productName))];
    const manualTypes = [...new Set(titleInfo.map((el) => el.manualType))];

    return `${productNames.join(" / ")} - ${manualTypes.join(" / ")}`;
  },
};

export const INSTRUMART_FORMATTERS = {
  joinTitles: (titles) => {
    let joinedLeftTitlesArray = [];
    let joinedRightTitlesArray = [];

    const titlesArray = titles.map((el) => el.split(" "));
    let titlesArrayModified = clone(titlesArray);

    const arrOfLength = titlesArray.map((el) => el.length);
    const minLength = arrOfLength.reduce((a, b) => Math.min(a, b), Infinity);

    for (let count = 0; count < minLength; count++) {
      const titlePart = titlesArray[0][count];

      if (titlesArray.every((el) => el[count] === titlePart)) {
        joinedLeftTitlesArray.push(titlePart);
        titlesArrayModified.forEach((el) => {
          el.shift();
        });
      } else {
        break;
      }
    }

    for (let count = 0; count < minLength; count++) {
      const titlePart = titlesArray[0][titlesArray[0].length - 1 - count];

      if (titlesArray.every((el) => el[el.length - 1 - count] === titlePart)) {
        joinedRightTitlesArray.unshift(titlePart);
        titlesArrayModified.forEach((el) => {
          el.pop();
        });
      } else {
        break;
      }
    }

    titlesArrayModified = titlesArrayModified.map((el) =>
      el.filter((el) => el.trim() !== "/").join(" ")
    );
    titlesArrayModified = titlesArrayModified.filter((el) => el.trim() !== "");

    const titlesArrayCenter =
      joinedLeftTitlesArray.length > 0 || joinedRightTitlesArray > 0
        ? `[ ${titlesArrayModified.join(" / ")} ]`
        : `${titlesArrayModified.join(" / ")}`;

    return `${joinedLeftTitlesArray.join(
      " "
    )} ${titlesArrayCenter} ${joinedRightTitlesArray.join(" ")}`.trim();
  },
};

export const CITIZENWATCH_FORMATTERS = INSTRUMART_FORMATTERS;

export const MSI_FORMATTERS = INSTRUMART_FORMATTERS;

export const WHIRLPOOL_FORMATTERS = INSTRUMART_FORMATTERS;
