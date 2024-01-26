import state from "#utils/classes/state.js";

export default function routeHandler(_) {
  return async ({ request, log, page }) => {
    log.debug(`request.url: ${request.url}`);

    while (true) {
      console.log("Parse " + page.url());

      await page.waitForSelector(".Card.GridItem");
      const cards = await page.locator(".Card.GridItem").all();

      for (const card of cards) {
        const products = [
          {
            url: await card
              .locator(".Card-title.GridItem-title > a")
              .getAttribute("href"),
            name: (
              await card.locator(".Card-title.GridItem-title > a").textContent()
            ).trim(),
          },
        ];

        await state.serializer.dump({ products }, { append: true });
      }

      await page.waitForSelector(".Pagination");

      if (
        !(await page.locator("li.Pagination-arrow.is-next > a").isVisible())
      ) {
        state.variables.continueLoop = false;
        break;
      }

      await page
        .locator("li.Pagination-arrow.is-next > a")
        .dispatchEvent("click");

      state.variables.lastPage++;
    }
  };
}
