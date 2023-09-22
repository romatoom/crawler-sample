import { Dataset, sleep } from "crawlee";
import { settings } from "#utils/globals.js";
import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";
import varSave from "#utils/var_saver.js";
import varRead from "#utils/var_reader.js";
import soundPlay from "#utils/sound_player.js";
import { getSelectOptions } from "#utils/playwright_helpers.js";

const LAST_PARSED_PRODUCT = {
  brand: "?",
  modelYear: "?",
  model: "?",
};

const SKIP = {
  brand: true,
  modelYear: true,
  model: true,
};

const SELECTS_BLOCK_SELECTOR =
  ".align-items-end.form-input-container div select";

const SUBMIT_BTN_SELECTOR =
  ".align-items-end.form-input-container .form-control button";

export default function addHandlerProductsManuals(router) {
  const { LABELS, currentName } = settings.source;

  router.addHandler(
    LABELS.MANUALS,
    async ({ request, page, log, parseWithCheerio }) => {
      log.debug(`request.url: ${request.url}`);

      while (true) {
        const done = await parseAll(page, parseWithCheerio, currentName);
        if (done) break;
      }
    }
  );
}

async function parseAll(page, parseWithCheerio, currentName) {
  const productSlugs = await varRead(
    "productSlugs",
    settings.source,
    "arrayWithoutBrackets"
  );
  try {
    const manualsDataset = await Dataset.open(`${currentName}/manuals`);
    const productsDataset = await Dataset.open(`${currentName}/products`);
    const productsManualsDataset = await Dataset.open(
      `${currentName}/products_manuals`
    );

    const selects = await page.locator(SELECTS_BLOCK_SELECTOR).all();
    const brandSelect = selects[0];
    const modelYearSelect = selects[1];
    const modelSelect = selects[2];

    const brandsElems = await brandSelect.locator("option").all();
    const brands = await getSelectOptions(brandsElems);

    for (const brand of brands) {
      if (brand.value === LAST_PARSED_PRODUCT.brand) {
        SKIP.brand = false;
      }

      if (SKIP.brand) {
        console.log(`${brand.title} skipped`);
        continue;
      }

      try {
        await brandSelect.selectOption(brand.value);
        await sleep(500);
      } catch (err) {
        continue;
      }

      const modelYearsElems = await modelYearSelect.locator("option").all();
      const modelYears = await getSelectOptions(modelYearsElems);

      for (const modelYear of modelYears) {
        if (
          brand.value === LAST_PARSED_PRODUCT.brand &&
          modelYear.value === LAST_PARSED_PRODUCT.modelYear
        ) {
          SKIP.modelYear = false;
        }

        if (SKIP.modelYear) {
          console.log(`${modelYear.title} skipped`);
          continue;
        }

        try {
          await brandSelect.selectOption(brand.value);
          await sleep(500);

          await modelYearSelect.selectOption(modelYear.value);
          await sleep(500);
        } catch (err) {
          continue;
        }

        const modelsElems = await modelSelect.locator("option").all();
        const models = await getSelectOptions(modelsElems);

        for (const model of models) {
          if (
            brand.value === LAST_PARSED_PRODUCT.brand &&
            modelYear.value === LAST_PARSED_PRODUCT.modelYear &&
            model.value === LAST_PARSED_PRODUCT.model
          ) {
            SKIP.model = false;
            console.log(`${model.title} skipped`);
            continue;
          }

          if (SKIP.model) {
            console.log(`${model.title} skipped`);
            continue;
          }

          console.log(
            `Current: ${brand.title}, ${modelYear.title}, ${model.title} (${brand.value}, ${modelYear.value}, ${model.value})`
          );

          const productSlug = `${brand.value};;;${modelYear.value};;;${model.value}`;

          if (productSlugs.includes(productSlug)) {
            continue;
          }

          productSlugs.push(productSlug);

          varSave(
            [productSlug],
            "productSlugs",
            settings.source,
            "append",
            "array"
          );

          if (models.length > 1) {
            try {
              await brandSelect.selectOption(brand.value);
              await sleep(500);

              await modelYearSelect.selectOption(modelYear.value);
              await sleep(500);

              await modelSelect.selectOption(model.value);
              await sleep(500);
            } catch (err) {
              continue;
            }

            await page.locator(SUBMIT_BTN_SELECTOR).click();
          }

          await page.waitForSelector(".vehicle-info");

          let product;
          let manuals;

          try {
            manuals = await getManuals(page);
            product = await getProduct(parseWithCheerio);
          } catch (err) {
            console.log(err);
          }

          if (
            product &&
            Object.keys(product).length === 2 &&
            manuals &&
            manuals.length > 0
          ) {
            const currentProductId = productIdGenerator.next().value;

            await productsDataset.pushData({
              innerId: currentProductId,
              brand: brand.title,
              category: "Vehicle",
              name: product.title,
              url: null,
              specs: [],
              images: product.image ? [product.image] : [],
              metadata: {
                modelYear: modelYear.title,
                model: model.title,
              },
            });

            for (const manual of manuals) {
              const currentManualId = manualIdGenerator.next().value;

              await manualsDataset.pushData({
                innerId: currentManualId,
                materialType: "Manual",
                pdfUrl: manual.pdfUrl,
                title: manual.title,
                language: manual.language,
                metadata: {},
              });

              await productsManualsDataset.pushData({
                productId: currentProductId,
                manualId: currentManualId,
              });
            }
          }

          await page.getByText("Reset").click();
          await sleep(400);
        }
      }
    }
  } catch (err) {
    console.error(err);

    soundPlay("fail");

    const lastProductSlug = productSlugs[productSlugs.length - 1];
    const lastProductSlugArr = lastProductSlug.split(";;;");

    LAST_PARSED_PRODUCT.brand = lastProductSlugArr[0];
    LAST_PARSED_PRODUCT.modelYear = lastProductSlugArr[1];
    LAST_PARSED_PRODUCT.model = lastProductSlugArr[2];
    SKIP.brand = true;
    SKIP.modelYear = true;
    SKIP.model = true;

    return false;
  }

  return true;
}

async function getProduct(parseWithCheerio) {
  const $ = await parseWithCheerio();
  const image = $(".vehicle-image img").attr("src");
  const title = $(".vehicle-info strong").text().trim();
  return { title, image };
}

async function getManuals(page) {
  await page.waitForSelector("#enhanced-owners-manuals__form-language-2326768");

  const languageValues = (
    await page
      .locator("#enhanced-owners-manuals__form-language-2326768 > option")
      .allTextContents()
  ).map((el) => el.trim());

  const manuals = [];

  for (const lang of languageValues) {
    await page
      .locator("#enhanced-owners-manuals__form-language-2326768")
      .selectOption({ label: lang });

    await sleep(400);

    const linkBlocks = await page.locator(".manual-link").all();

    for (const linkBlock of linkBlocks) {
      const manualTitle = (
        await linkBlock.locator("div span").textContent()
      ).trim();

      const links = await linkBlock.locator("a").all();
      let url;

      for (const link of links) {
        let href = await link.getAttribute("href");
        if (href.endsWith(".pdf")) {
          url = href;
          break;
        }
      }

      if (url) {
        manuals.push({
          title: manualTitle || `Manual for ${modelYear - model}`,
          pdfUrl: url,
          language: lang,
        });
      }
    }
  }

  return manuals;
}
