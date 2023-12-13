import { urlsHashes } from "#utils/classes/urlGetter/urlGetter.js";

export default function routeHandler() {
  return async ({ request, page, log }) => {
    log.info(`request.url: ${request.url}`);

    await page.waitForSelector("#download");

    // Start waiting for download before clicking. Note no await.
    const downloadPromise = page.waitForEvent("download");

    await page.locator("#download").click();

    const download = await downloadPromise;
    await download.cancel();

    urlsHashes[request.url] = download.url();

    console.log("URL inserted. Count:", Object.keys(urlsHashes).length);
  };
}
