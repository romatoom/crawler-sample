import { LABELS } from "../constants.js";
import { setLangs, setLangCountryCodes } from "../temp_data.js";
import uniqWith from "lodash/uniqWith.js";

function compareLanguages(lang1, lang2) {
  return lang1.langName === lang2.langName && lang1.langCode === lang2.langCode;
}

export default function addHandlerLangs(router) {
  router.addHandler(LABELS.LANGS, async ({ request, crawler, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const langsLinks = $("a.block-link");
    const langCountryCodes = [];
    let langs = [];

    for (const langLinkItem of langsLinks) {
      const elem = $(langLinkItem);

      const langName = elem.find(".country-name").text().split(" - ")[1];

      const regexp = /^\/(\w{2}_\w{2})\/home$/;
      const matches = elem.attr("href").match(regexp);

      const langCountryCode = matches[1];
      const langCode = langCountryCode.split("_")[0];

      langs.push({
        langName,
        langCode,
      });

      langCountryCodes.push(langCountryCode);
    }

    langs = uniqWith(langs, compareLanguages);

    const italianLangs = langs.filter((l) => l.langCode === "it");
    const wrongItalianLangNames = italianLangs
      .filter((l) => l.langName !== "Italiano")
      .map((l) => l.langName);

    langs = langs.filter((l) => !wrongItalianLangNames.includes(l.langName));

    setLangs(langs);
    setLangCountryCodes(langCountryCodes);
  });
}
