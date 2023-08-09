import { Dataset } from "crawlee";
import { settings } from "#utils/globals.js";
import sleep from "#utils/sleep.js";
import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";
import { canUseUrlGetter } from "#utils/url_getter/index.js";

const PREFIX_FOR_IGNORED_OPTIONS = "Please select";
const CATEGORY_SELECTOR = "select[name='j_id0:j_id3:j_id11:j_id16']";
const PRODUCT_SELECTOR = "select[name='j_id0:j_id3:j_id11:j_id20']";
const LANGUAGE_SELECTOR = "select[name='j_id0:j_id3:j_id11:j_id24']";
const LINKS_BLOCK_SELECTOR = "tbody[id='j_id0:j_id3:j_id11:j_id26:tb']";

export default function addHandlerProductsManuals(router) {
  const { LABELS, BRAND, currentName } = settings.source;

  router.addHandler(LABELS.PRODUCTS_MANUALS, async ({ request, page, log }) => {
    log.debug(`request.url: ${request.url}`);

    const manualsDataset = await Dataset.open(`${currentName}/manuals`);
    const productsDataset = await Dataset.open(`${currentName}/products`);
    const productsManualsDataset = await Dataset.open(
      `${currentName}/products_manuals`
    );

    await page.waitForSelector(CATEGORY_SELECTOR);
    const categorySelect = await page.locator(CATEGORY_SELECTOR);

    const categories = (
      await page.locator(`${CATEGORY_SELECTOR} > option`).allTextContents()
    ).filter((el) => !el.startsWith(PREFIX_FOR_IGNORED_OPTIONS));

    for (const category of categories) {
      try {
        await categorySelect.selectOption({ label: category });
        await sleep(2000);
        await page.waitForSelector(PRODUCT_SELECTOR);
      } catch (err) {
        continue;
      }

      const productSelect = await page.locator(PRODUCT_SELECTOR);

      const products = (
        await page.locator(`${PRODUCT_SELECTOR} > option`).allTextContents()
      ).filter((el) => !el.startsWith(PREFIX_FOR_IGNORED_OPTIONS));

      for (const product of products) {
        const currentProductId = productIdGenerator.next().value;

        try {
          await productSelect.selectOption({ label: product });
          await sleep(2000);
          await page.waitForSelector(LANGUAGE_SELECTOR);
        } catch (err) {
          continue;
        }

        const languageSelect = await page.locator(LANGUAGE_SELECTOR);

        const languages = (
          await page.locator(`${LANGUAGE_SELECTOR} > option`).allTextContents()
        ).filter((el) => !el.startsWith(PREFIX_FOR_IGNORED_OPTIONS));

        for (const language of languages) {
          try {
            await languageSelect.selectOption({ label: language });
            await sleep(2000);
            await page.waitForSelector(LINKS_BLOCK_SELECTOR);
          } catch (err) {
            continue;
          }

          const links = await page.locator(`${LINKS_BLOCK_SELECTOR} a`);

          const linksCount = (await links.allTextContents()).length;

          for (let i = 0; i <= linksCount - 1; i++) {
            const linkText = await links.nth(i).textContent();
            let pdfUrl = await links.nth(i).getAttribute("href");

            // Fixes urls
            if (
              pdfUrl ===
              "https://gopro.com/content/dam/help/hero5-black/quick-start-guides/HERO5Black_QSG_SV_REVB_Web.pdhttps://gopro.com/content/dam/help/hero5-black/quick-start-guides/HERO6Black-HERO5Black_QSG_REVB.pdf"
            ) {
              pdfUrl =
                "https://gopro.com/content/dam/help/hero5-black/quick-start-guides/HERO5Black_QSG_SV_REVB_Web.pdf";
            }

            if (!pdfUrl.endsWith(".pdf") && !canUseUrlGetter(pdfUrl)) {
              continue;
            }

            const materialType =
              linkText === "Quick Start Guides"
                ? "Quick Start Guide"
                : "Manual";

            const currentManualId = manualIdGenerator.next().value;

            await manualsDataset.pushData({
              innerId: currentManualId,
              materialType,
              pdfUrl,
              title: `${product} - ${materialType}`,
              language,
              metadata: {},
            });

            await productsDataset.pushData({
              innerId: currentProductId,
              brand: BRAND,
              category,
              name: product,
              url: null,
              specs: [],
              images: [],
              metadata: {},
            });

            await productsManualsDataset.pushData({
              productId: currentProductId,
              manualId: currentManualId,
            });
          }
        }
      }
    }
  });
}
