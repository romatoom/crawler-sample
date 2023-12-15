import { sleep } from "crawlee";

export default function routeHandler(source) {
  return async ({ request, log, page, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const targets = [];

    // await page.waitForSelector(".software-product-list");

    const tabs = await page.locator(".van-tab").all();

    for (const tab of tabs) {
      await tab.click();

      await sleep(3000);

      for (const product of await page
        .locator(".software-product-item a")
        .all()) {
        let url = await product.getAttribute("href");

        url = `https://support.oppo.com${url}`;

        const model = (
          await product.locator(".software-product-name").textContent()
        )
          .replaceAll("OPPO", "")
          .trim();

        const series =
          request.userData.data.models.find((m) => m.model === model)?.series ||
          "Undefined";

        targets.push({
          url,
          label: "MANUALS",
          userData: {
            data: {
              ...request.userData.data,
              model,
              series,
            },
          },
        });
      }
    }

    await crawler.addRequests(targets);
  };
}
