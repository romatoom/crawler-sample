import { settings } from "#utils/globals.js";
import { pageCount } from "#utils/calc.js";
import { getMainURL } from "#utils/paths.js";

export default function addHandlerSupportProducts(router) {
  const { LABELS, LANGS } = settings.source;

  // https://support.casio.com/de/manual/manualresult.php?cid=008&keyword=
  router.addHandler(
    LABELS.SUPPORT_PRODUCTS,
    async ({ request, $, log, crawler }) => {
      log.debug(`request.url: ${request.url}`);

      const mainUrl = getMainURL(request.url);

      const { locale, category } = request.userData.data;

      const blockOfLinks = $("h2").next();

      if (!request.url.includes("&page=")) {
        const total = blockOfLinks.find("div > span").text();

        if (total) {
          const targets = [];

          const countOfPages = pageCount(total, 20);
          for (let page = 2; page <= countOfPages; page++) {
            targets.push({
              url: encodeURI(`${request.url}&page=${page}`),
              label: LABELS.SUPPORT_PRODUCTS,
              userData: {
                data: {
                  locale,
                  category,
                },
              },
            });
          }

          await crawler.addRequests(targets);
        }
      }

      const links = blockOfLinks.find(".grid-w--3.frame > .column--2 > a");
      if (!links) return;

      const manualsTargets = [];

      for (const link of links) {
        const productUrl = `${mainUrl}${$(link)
          .attr("href")
          .replace("./", "/")}`;
        const productTitle = $(link).text().trim();

        for (const [_locale, _language] of Object.entries(LANGS)) {
          const url =
            _locale === locale
              ? productUrl
              : productUrl.replace(
                  `//support.casio.com/${locale}/`,
                  `//support.casio.com/${_locale}/`
                );

          manualsTargets.push({
            url: encodeURI(url),
            label: LABELS.SUPPORT_MANUALS,
            userData: {
              data: {
                category,
                productTitle,
              },
            },
          });
        }
      }

      await crawler.addRequests(manualsTargets);
    }
  );
}
