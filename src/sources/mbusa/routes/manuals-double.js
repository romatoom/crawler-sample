import { Dataset, sleep } from "crawlee";
import { settings } from "#utils/globals.js";
import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";
import { getSelectOptions } from "#utils/playwright_helpers.js";

export default function addHandlerManualsDouble(router) {
  const { LABELS, BRAND, currentName } = settings.source;

  router.addHandler(LABELS.MANUALS_DOUBLE, async ({ request, page, log }) => {
    log.debug(`request.url: ${request.url}`);

    const productsDataset = await Dataset.open(`${currentName}/products`);

    const manualsDataset = await Dataset.open(`${currentName}/manuals`);

    const productsManualsDataset = await Dataset.open(
      `${currentName}/products_manuals`
    );

    const datasets = {
      productsDataset,
      manualsDataset,
      productsManualsDataset,
    };

    await page.waitForSelector(
      ".button.button--only-technically-necessary.wb-button.hydrated"
    );
    await page
      .locator(".button.button--only-technically-necessary.wb-button.hydrated")
      .click();

    await page.waitForSelector("wb-card.model-gallery__card");

    const cards = await page.locator("wb-card.model-gallery__card").all();

    for (const cardElem of cards) {
      const category = (await cardElem.locator("h2").textContent())
        .trim()
        .toUpperCase();

      const bodyTypes = await cardElem
        .locator(".vehicle-selector__body-types > wb-tag")
        .all();

      for (const bodyTypeElem of bodyTypes) {
        const bodyType = (await bodyTypeElem.textContent())
          .replaceAll("é", "e")
          .trim()
          .toUpperCase();

        await bodyTypeElem.click();
        await sleep(1000);

        const image = await cardElem
          .locator("img.vehicle-selector__body-image")
          .getAttribute("src");

        const modelReleaseSelector = await cardElem.locator(
          ".vehicle-selector__release select"
        );

        const modelReleaseOptions = await cardElem
          .locator(".vehicle-selector__release select > option")
          .all();

        const modelReleaseItems = await getSelectOptions(modelReleaseOptions);

        for (const modelRelease of modelReleaseItems) {
          let hasVariants = true;
          let currentVariant = 0;

          while (hasVariants) {
            await modelReleaseSelector.selectOption(modelRelease.value);
            await sleep(500);

            await cardElem
              .locator(".vehicle-selector__release .wb-button")
              .click();

            await sleep(500);

            const modalExists = await page.isVisible(
              ".modal > .modal__wrapper"
            );

            if (modalExists) {
              const modal = await page.locator(".modal > .modal__wrapper");

              const variants = await modal.locator("wb-radio-control").all();

              const variantsLength = variants.length;

              if (currentVariant >= variantsLength) {
                await modal.getByText("Cancel").click();
                break;
              }

              await variants[currentVariant].click();
              currentVariant += 1;

              await modal.getByText("Confirm").click();
            } else {
              hasVariants = false;
            }

            const pdfUrl = await page
              .getByRole("link", { name: "Download PDF" })
              .getAttribute("href");

            const model = (
              await page.locator(".vehicle-header__vehicle-date").textContent()
            ).trim();

            if (pdfUrl.endsWith(".pdf")) {
              const data = {
                category,
                bodyType,
                image,
                pdfUrl,
                modelRelease: modelRelease.title,
                model,
              };
              await saveDataToDatasets(data, datasets, settings.source);
            }

            await page.goto(request.url);

            await bodyTypeElem.click();
            await sleep(500);
          }
        }
      }
    }
  });
}

async function saveDataToDatasets(
  { category, bodyType, image, pdfUrl, modelRelease, model },
  { productsDataset, manualsDataset, productsManualsDataset },
  source
) {
  let series = `${category} ${bodyType}`;

  series = series.replace("SALOON", "SEDAN (SALOON)");
  series = series.replace("ESTATE", "WAGON (ESTATE)");

  const currentManualId = manualIdGenerator.next().value;
  const materialType = "Owner's Manual";

  await manualsDataset.pushData({
    innerId: currentManualId,
    materialType,
    pdfUrl,
    title: `${materialType} for ${series}`,
    language: "English",
    metadata: {
      series,
    },
  });

  const currentProductId = productIdGenerator.next().value;

  await productsDataset.pushData({
    innerId: currentProductId,
    brand: source.BRAND,
    category: "Vehicles",
    name: `${series} - ${model}`,
    url: null,
    specs: [],
    images: [image],
    metadata: {
      series,
      modelRelease,
      model,
    },
  });

  await productsManualsDataset.pushData({
    productId: currentProductId,
    manualId: currentManualId,
  });
}
