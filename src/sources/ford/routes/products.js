import { sleep } from "crawlee";
import state from "#utils/classes/state.js";

export default function routeHandler(_) {
  return async ({ request, log, page }) => {
    log.debug(`request.url: ${request.url}`);

    const productsAttributes = [];

    await page.locator("#year-dropdown").click();
    await sleep(500);

    const yearsList = await page
      .locator(".year-dropdown .dropdown-container > ul > li")
      .all();

    for (const yearElem of yearsList) {
      await page.locator("#year-dropdown").click();
      await sleep(500);

      const year = await yearElem.textContent();

      await yearElem.click();

      await page.locator("#model-dropdown").click();
      await sleep(500);

      const modelsList = await page
        .locator(".model-dropdown .dropdown-container > ul > li")
        .all();

      for (const modelElem of modelsList) {
        const model = await modelElem.textContent();

        productsAttributes.push({
          year,
          model,
        });
      }
    }

    await state.serializer.dump({ productsAttributes });
  };
}
