import { CheerioCrawler, log } from "crawlee";
import { router } from "./routes.js";
import { BASE_URL, SOURCE_NAME, LABELS } from "./constants.js";
import exportDataToSqlite from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import productsInfo from "./get_products_info.js";

// https://sgp-api.buy.mi.com/global/search/v1/api/index//0/0/0/0/0/0?version=v4&from=pc&pagesize=1000

export default async function startMi() {
  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  // const pInfo = await productsInfo();

  const crawler = new CheerioCrawler({
    requestHandler: router,
  });

  log.info("Adding requests to the queue.");

  await crawler.addRequests([
    {
      url: `${BASE_URL}/global/support/user-guide`,
      label: LABELS.START_USER_GUIDES,
    },
    {
      url: `${BASE_URL}/global/sitemap`,
      label: LABELS.START_SITEMAP,
    },
  ]);

  await dropDatasets(SOURCE_NAME);
  await crawler.run();

  await exportDatasets(SOURCE_NAME);
  await exportDataToSqlite(SOURCE_NAME);
}

/*
{
    name: 'Mi Wi-Fi Range Extender Pro',
    images: [
      'https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1666845177.28494169.png'
    ],
    url: 'https://www.mi.com/global/product/mi-wifi-range-extender-pro/',
    category: 'Office'
  },
*/
