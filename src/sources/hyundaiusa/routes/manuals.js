import { Dataset, sleep } from "crawlee";
import { settings } from "#utils/globals.js";
import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";
import { getSelectOptions } from "#utils/playwright_helpers.js";

const lastYear = "2011";
const lastModel = "genesis-coupe";
let skipYear = lastYear.length > 0;
let skipModel = lastModel.length > 0;

export default function addHandlerManuals(router) {
  const { LABELS, currentName, BASE_URL } = settings.source;

  router.addHandler(LABELS.MANUALS, async ({ request, page, log }) => {
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

    const yearsOptions = await page.locator("#gr_filter_year > option").all();

    const years = await getSelectOptions(yearsOptions);

    for (const year of years) {
      console.log(year.value);

      if (skipYear && year.value === lastYear) {
        skipYear = false;
      }

      if (skipYear) continue;

      await page.locator("#gr_filter_year").selectOption(year.value);
      await sleep(500);

      const modelOptions = await page
        .locator("#gr_filter_model > option")
        .all();

      const models = await getSelectOptions(modelOptions);

      for (const model of models) {
        console.log(model.value);

        if (skipModel && model.value === lastModel) {
          skipModel = false;
        }

        if (skipModel) continue;

        await page.locator("#gr_filter_model").selectOption(model.value);
        await sleep(500);

        const trimOptions = await page
          .locator("#gr_filter_trim > option")
          .all();

        let trims = await getSelectOptions(trimOptions);

        if (trims.length === 0) {
          trims = [
            {
              value: null,
            },
          ];
        }

        for (const trim of trims) {
          if (trim.value) {
            await page.locator("#gr_filter_trim").selectOption(trim.value);
            await sleep(500);
          }

          const links = await page
            .locator(
              "ul.resource-list.first-res-list.second-res-list > li > .article-title > a"
            )
            .all();

          for (const link of links) {
            let url = await link.getAttribute("href");
            if (!url.endsWith(".pdf")) continue;
            url = `${BASE_URL}${url}`;

            const manualTitle = await link.textContent();

            const data = {
              url,
              manualTitle,
              year: year.title,
              model: model.value === "tucson-hev" ? `Tucson HEV` : model.title,
              trim: trim.value,
            };

            await saveDataToDatasets(data, datasets, settings.source);
          }
        }
      }
    }
  });
}

async function saveDataToDatasets(
  { url, manualTitle, year, model, trim },
  { productsDataset, manualsDataset, productsManualsDataset },
  source
) {
  const currentManualId = manualIdGenerator.next().value;

  let materialType = "Manual";

  for (const manualType of source.MANUAL_TYPES) {
    if (manualTitle.includes(manualType)) {
      materialType = manualType;
      break;
    }
  }

  await manualsDataset.pushData({
    innerId: currentManualId,
    materialType,
    pdfUrl: url,
    title: manualTitle,
    language: "English",
    metadata: {},
  });

  const currentProductId = productIdGenerator.next().value;

  const product = {
    innerId: currentProductId,
    brand: source.BRAND,
    category: "Vehicles",
    name: `${year} ${model}`,
    url: null,
    specs: [],
    images: [],
    metadata: {
      year,
      model,
    },
  };

  if (trim) {
    product.metadata.trim = trim;
    product.name += ` ${trim}`;
  }

  await productsDataset.pushData(product);

  await productsManualsDataset.pushData({
    productId: currentProductId,
    manualId: currentManualId,
  });
}
