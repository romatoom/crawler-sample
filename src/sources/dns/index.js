import { CheerioCrawler, log, sleep } from "crawlee";
import { router, addRouterHandlers } from "./routes.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { settings } from "#utils/globals.js";

import { getCategories, getProductsURLs } from "./api-utils.js";
import { pageCount } from "#utils/calc.js";
import varSave from "#utils/var_saver.js";
import varRead from "#utils/var_reader.js";

import soundPlay from "#utils/sound_player.js";

import uniqBy from "lodash/uniqBy.js";
import differenceBy from "lodash/differenceBy.js";

import {
  setProductUrlGenerator,
  getProductUrl,
} from "./products_urls_generator.js";

import { getCookies } from "#utils/cookie_parser.js";

const COOKIES = getCookies();

// Устанавливается при прерывании из-за ошибки (при необходимости смены Cookie)
const LAST_SUCCESS_PARSED_CATEGORY_UID = "";

// Устновить в true, если url продуктов полностью спаршены
const ALL_PRODUCTS_URLS_PARSED = true;

export default async function startDns() {
  const { BASE_URL } = settings.source;

  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  addRouterHandlers();

  if (!ALL_PRODUCTS_URLS_PARSED) {
    await scrapeProductsURLs();
  }

  let productsURLs = await varRead(
    "productsURLs",
    settings.source,
    "arrayWithoutBrackets"
  );

  productsURLs = uniqBy(productsURLs, "url");

  let processedURLs = await varRead(
    "processedURLs",
    settings.source,
    "arrayWithoutBrackets"
  );

  productsURLs = differenceBy(productsURLs, processedURLs, "url");

  // await dropDatasets();

  await scrapeProducts(productsURLs);

  // await exportDatasets();
  // await exportDataToSqlite();

  soundPlay("end");
}

async function scrapeProducts(productsURLs) {
  const { LABELS } = settings.source;

  const crawler = new CheerioCrawler({
    requestHandler: router,
    // maxConcurrency: 1,
    useSessionPool: true,
    persistCookiesPerSession: true,
    preNavigationHooks: [
      async (crawlingContext, _) => {
        crawlingContext.session.setCookies(
          COOKIES,
          crawlingContext.request.url
        );

        crawlingContext.request.headers["Cityid"] =
          "55506b4d-0565-11df-9cf0-00151716f9f5";
        crawlingContext.request.headers["User-Agent"] =
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36";
        crawlingContext.request.headers["Siteid"] =
          "8c2e120b-8732-48a7-8178-0e04d47962d8";
        crawlingContext.request.headers["Host"] = "www.dns-shop.ru";
        crawlingContext.request.headers["Accept"] =
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7";
      },
    ],
    errorHandler: (inputs, error) => {
      if (inputs.response.statusCode === 401) {
        soundPlay("fail");
        console.error("Need update COOKIES_STR (src/utils/cookie_parser.js)");
        process.exit();
      }
    },
  });

  log.info("Adding requests to the queue.");

  setProductUrlGenerator(productsURLs);

  const productUrl = getProductUrl();

  try {
    await crawler.run([
      {
        url: productUrl.url,
        label: LABELS.PRODUCT,
        userData: {
          data: {
            category: productUrl.category,
          },
        },
      },
    ]);
  } catch (err) {
    console.log(err);
  }
}

async function scrapeProductsURLs() {
  let categories = null;
  try {
    categories = await getCategories();
  } catch (err) {
    console.error(err);
    process.exit();
  }

  let pass = LAST_SUCCESS_PARSED_CATEGORY_UID !== "";

  try {
    for (const categoryItem of categories) {
      if (
        LAST_SUCCESS_PARSED_CATEGORY_UID !== "" &&
        categoryItem.searchUid === LAST_SUCCESS_PARSED_CATEGORY_UID
      ) {
        pass = false;
      }

      if (pass) continue;

      console.log(
        `Start adding ${categoryItem.count} items of category with SearchUID = ${categoryItem.searchUid}`
      );

      const pCount = pageCount(categoryItem.count);

      for (let page = 1; page <= pCount; page++) {
        sleep(500);

        try {
          const productsOnPage = await getProductsURLs(categoryItem, page);

          if (!productsOnPage || productsOnPage.length === 0) continue;

          varSave(
            productsOnPage,
            "productsURLs",
            settings.source,
            "append",
            "array"
          );

          console.log(
            `${productsOnPage.length} items has been added to productsURLs`
          );
        } catch (err) {
          if (err.response?.status === 401) {
            console.error(
              "Need update COOKIES_STR (src/utils/cookie_parser.js)"
            );

            console.log(
              `Set const LAST_SUCCESS_PARSED_CATEGORY_UID to ${categoryItem.searchUid}`
            );

            soundPlay("fail");

            process.exit();
          }
        }
      }
    }
  } catch (err) {
    console.error(err);
    soundPlay("fail");
    process.exit();
  }
}
