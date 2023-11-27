import { PlaywrightCrawler, CheerioCrawler, log, Dataset } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import { exportDataToSqlite } from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { settings } from "#utils/globals.js";
import { setGenerators } from "#utils/generators.js";
import varRead from "#utils/var_reader.js";
import { manualIdGenerator, productIdGenerator } from "#utils/generators.js";

export default async function start() {
  const { BASE_URL, HELP_URL, LABELS } = settings.source;

  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  addRouterHandlers();

  const crawler = new CheerioCrawler({
    requestHandler: router,
    minConcurrency: 1,
    maxConcurrency: 10,
    maxRequestsPerMinute: 100,
  });

  log.info("Adding requests to the queue.");

  await dropDatasets();

  await setGenerators(settings.source);

  let parsedManuals;
  try {
    parsedManuals = await varRead("manuals", settings.source);
  } catch (err) {
    const playwrightCrawler = new PlaywrightCrawler({
      requestHandler: router,
      headless: true,
      requestHandlerTimeoutSecs: 500000,
    });

    await playwrightCrawler.run([
      {
        url: `${HELP_URL}/manuals/`,
        label: LABELS.MANUALS,
      },
    ]);

    parsedManuals = await varRead("manuals", settings.source);
  }

  await crawler.run([
    {
      url: `${BASE_URL}/collections/all`,
      label: LABELS.PRODUCTS,
      userData: {
        data: {
          parsedManuals,
        },
      },
    },
  ]);

  await addManuals(parsedManuals, settings.source);

  await exportDatasets();
  await exportDataToSqlite();
}

async function addManuals(parsedManuals, source) {
  const manualsDataset = await Dataset.open(`${source.currentName}/manuals`);
  const productsDataset = await Dataset.open(`${source.currentName}/products`);
  const productsManualsDataset = await Dataset.open(
    `${source.currentName}/products_manuals`
  );

  const skuList = await varRead(
    "skuList",
    settings.source,
    "arrayWithoutBrackets"
  );

  for (const sku in parsedManuals) {
    if (skuList.includes(sku) || parsedManuals[sku].length === 0) continue;

    const productId = productIdGenerator.next().value;

    await productsDataset.pushData({
      innerId: productId,
      brand: source.BRAND,
      category: "Other",
      name: sku,
      url: null,
      specs: [],
      images: [],
      sku,
      metadata: {},
    });

    for (const manual of parsedManuals[sku]) {
      const manualId = manualIdGenerator.next().value;

      await manualsDataset.pushData({
        innerId: manualId,
        materialType: manual.manualType,
        pdfUrl: manual.manualURL,
        title: manual.manualTitle,
        language: [],
        metadata: {},
      });

      await productsManualsDataset.pushData({
        productId: productId,
        manualId: manualId,
      });
    }
  }
}
