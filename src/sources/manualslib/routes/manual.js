import { LABELS, BASE_URL } from "../constants.js";
import { dataForPlaywrightCrawler } from "../playwright_crawler.js";

export default function addHandlerManual(router) {
  router.addHandler(
    LABELS.MANUAL,
    async ({ request, /* page, parseWithCheerio*/ $, log }) => {
      log.debug(`request.url: ${request.url}`);

      const manualTitle = $(".manual-header__content h1").text();
      const downloadPageURL = $(".btn__download-manual").attr("href");
      const url = `${BASE_URL}${downloadPageURL}`;

      dataForPlaywrightCrawler.push({
        url,
        label: LABELS.DOWNLOAD_MANUAL,
        userData: {
          data: {
            ...request.userData.data,
            manualTitle,
          },
        },
      });
    }
  );
}
