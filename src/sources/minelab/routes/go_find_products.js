import { sleep } from "crawlee";
import { settings } from "#utils/globals.js";
import { getRandomArbitrary } from "#utils/calc.js";

export default function addHandlerGoFindProducts(router) {
  const { LABELS, BRAND, currentName, BASE_URL } = settings.source;

  router.addHandler(
    LABELS.GO_FIND_PRODUCTS,
    async ({ request, $, log, crawler }) => {
      log.debug(`request.url: ${request.url}`);

      const targets = [];

      $("#discover-the-series .row > div > div.content-block").each(
        (_, product) => {
          let image = $(product).find("img").attr("src");
          image = `${request.url}${image}`;

          const title = $(product).find("h4").text().trim();

          let link = $(product).find("span > a").attr("href");
          link = `${request.url}${link}`;

          targets.push({
            url: link,
            label: LABELS.GO_FIND_PRODUCT,
            userData: {
              data: {
                title,
                image,
              },
            },
          });
        }
      );

      for (const target of targets) {
        await crawler.addRequests([target]);
        await sleep(Math.floor(getRandomArbitrary(20000, 50000)));
      }
    }
  );
}
