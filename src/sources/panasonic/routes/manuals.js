import { sleep } from "crawlee";
import { settings } from "#utils/globals.js";
import varSave from "#utils/var_saver.js";

export default function addHandlerManuals(router) {
  const { LABELS, HELP_URL, MANUAL_TYPES } = settings.source;

  router.addHandler(
    LABELS.MANUALS,
    async ({ request, page, log, parseWithCheerio }) => {
      log.debug(`request.url: ${request.url}`);

      await page.waitForSelector("#categoriesContainer");

      const categories = await page.locator("#categoriesContainer li").all();

      const manuals = {};

      for (let i = 0; i < categories.length; i++) {
        await categories[i].click();
        await sleep(1000);

        const $ = await parseWithCheerio();

        $(
          "#categorySectionContainer .categorySection ul.outputList > li.modelItem"
        ).each((_, model) => {
          const sku = $(model)
            .contents()
            .filter(function () {
              return this.type === "text";
            })
            .text()
            .trim();

          manuals[sku] = [];

          $(model)
            .find("ul.modelEntryList > li.modelEntry > a")
            .each((_, link) => {
              const manualURL = `${HELP_URL}${$(link).attr("href")}`;
              if (!manualURL.endsWith(".pdf")) return true;

              const manualTitle = $(link).text().trim();

              let manualType = "Manual";

              for (const manualTypeItem of MANUAL_TYPES) {
                if (manualTitle.includes(manualTypeItem)) {
                  manualType = manualTypeItem;
                  break;
                }
              }

              manuals[sku].push({ manualTitle, manualType, manualURL });
            });
        });
      }

      varSave(manuals, "manuals", settings.source);
    }
  );
}
