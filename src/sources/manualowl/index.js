import { CheerioCrawler, PlaywrightCrawler, Router, log } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { readProducts } from "#utils/database.js";
import { settings } from "#utils/globals.js";

import varSave from "#utils/var_saver.js";

import {
  normalizeMatrix,
  printMatrix,
  solveCaptcha,
} from "./captcha_solver.js";

export default async function start() {
  const { BASE_URL, LABELS } = settings.source;

  log.setLevel(log.LEVELS.DEBUG);
  log.debug(`Setting up crawler for "${BASE_URL}"`);

  // addRouterHandlers();

  const crawlerRouter = Router.create();

  crawlerRouter.addHandler(
    LABELS.DOWNLOAD_MANUAL,
    async ({ log, request, page, parseWithCheerio }) => {
      log.debug(`request.url: ${request.url}`);

      await page.waitForSelector(".captchatable tbody");

      const $ = await parseWithCheerio();
      const captchaRows = $(".captchatable tbody tr");

      let captchaMatrix = [];

      for (const row of captchaRows) {
        const rowCells = $(row).find("td");
        const matrixRow = [];

        for (const cell of rowCells) {
          const cellElem = $(cell).attr("class");
          const value = cellElem === "capc1" ? 0 : 1;
          matrixRow.push(value);
        }

        captchaMatrix.push(matrixRow);
      }

      captchaMatrix = normalizeMatrix(captchaMatrix);

      printMatrix(captchaMatrix);

      const solve = await solveCaptcha(captchaMatrix);

      console.log("Solve:", solve);
      // page.locator(".button-get-manual").click();
    }
  );

  const playwrightCrawler = new PlaywrightCrawler({
    requestHandler: crawlerRouter,
    headless: true,
  });

  await playwrightCrawler.run([
    {
      url: `${BASE_URL}/m/Samsung/SSG-4100GB/Download/422836`,
      label: LABELS.DOWNLOAD_MANUAL,
    },
  ]);

  /*
  const crawler = new CheerioCrawler({
    requestHandler: router,
    maxRequestRetries: 2,
    requestHandlerTimeoutSecs: 10,
    minConcurrency: 10,
    maxConcurrency: 50,
  });

  if (settings.onlyNewProducts) {
    let existingProducts;
    try {
      existingProducts = await readProducts();
    } catch (err) {
      log.error(err);
      existingProducts = [];
    }
    setExistingProducts(existingProducts);
  }

  log.info("Adding requests to the queue.");

  await crawler.run([
    {
      url: `${BASE_URL}/ue_US/change-country-region-language`,
      label: LABELS.LANGS,
    },
  ]);

  await dropDatasets();

  log.info("Adding requests to the queue.");

  // ue_US
  // en_GB

  const targets = [];
  for (const langCountryCode of ["en_GB"]) {
    targets.push({
      url: `${BASE_URL}/${langCountryCode}/sitemap`,
      label: LABELS.SITEMAP,
    });
  }
  await crawler.run(targets);

  await exportDatasets();
  await exportDataToSqlite();*/
}
