import { sleep } from "crawlee";
import state from "#utils/classes/state.js";

export default function routeHandler(source) {
  return async ({ request, log, page, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    await page.waitForSelector(".pcghome-method.pc-browse");

    const modalExists = await page.isVisible(".modal-body.main-body.fade.in");
    if (modalExists) {
      await page.locator(".button.btn_no").click();
    }

    await page.locator(".pcghome-method.pc-browse").click();

    const categories = await page
      .locator(".prods-module.prods-types > div.prod-item")
      .all();

    for (const categoryElem of categories) {
      const category = await categoryElem
        .locator(".product-label")
        .textContent();

      await categoryElem.click();

      const [seriesDropdown, subseriesDropdown] = await page
        .locator(".dropdown-group .wrapper-dropdown")
        .all();

      await seriesDropdown.click();
      const seriesList = await seriesDropdown
        .locator("ul > li[data-value]")
        .all();

      for (const seriesItem of seriesList) {
        const seriesTitle = await seriesItem.textContent();

        await seriesDropdown.click();
        await seriesItem.click();
        await sleep(300);

        await subseriesDropdown.click();
        const subseriesList = await subseriesDropdown
          .locator("ul > li[data-value]")
          .all();

        for (const subseriesItem of subseriesList) {
          const partOfURL = (
            await subseriesItem.getAttribute("data-fullid")
          ).toLowerCase();

          const subseriesTitle = await subseriesItem.textContent();

          await state.serializer.dump(
            {
              productsData: [
                { partOfURL, seriesTitle, subseriesTitle, category },
              ],
            },
            { append: true }
          );
        }
      }
    }
  };
}
