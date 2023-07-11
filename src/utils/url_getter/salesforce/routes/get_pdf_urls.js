import { LABELS } from "#utils/url_getter/constants.js";
import { SOURCES } from "#utils/globals.js";

export default function addHandlerGetPdfUrls(router) {
  router.addHandler(LABELS.GET_PDF_URL, async ({ request, page, log }) => {
    log.debug(`request.url: ${request.url}`);

    await page.waitForSelector("button.downloadbutton");

    // Start waiting for download before clicking. Note no await.
    const downloadPromise = page.waitForEvent("download");

    await page.locator("button.downloadbutton").click();

    const download = await downloadPromise;
    await download.cancel();

    const { sourceKey } = request.userData.data;

    SOURCES[sourceKey].urlsHash[request.url] = download.url();

    console.log(
      "URL inserted. Count:",
      Object.keys(SOURCES[sourceKey].urlsHash).length
    );
  });
}
