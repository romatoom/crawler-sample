import { PlaywrightCrawler, log } from "crawlee";

import { Source } from "#utils/classes/source.js";
import state from "#utils/classes/state.js";

import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

import { OppoAPI } from "./api.js";

export default class OppoSource extends Source {
  baseURL = "https://www.oppo.com";
  brand = "OPPO";
  name = "oppo";

  joinTitles = BASE_MANUAL_TITLE_JOINER;

  categoriesHash = {
    "Find N": "Smartphones",
    Find: "Smartphones",
    Reno: "Smartphones",
    "A ( AX )": "Smartphones",
    "R ( RX )": "Smartphones",
    Tablets: "Tablets",
    ColorOS: "Operating Systems",
    Accessories: "Accessories",
  };

  constructor() {
    super();
  }

  async init() {
    await this.addRoutes();

    log.info(`Setting up crawler for "${this.baseURL}"`);

    this.playwrightCrawler = new PlaywrightCrawler({
      requestHandler: this.router,
      headless: true,
      requestHandlerTimeoutSecs: 500000,
      maxRequestRetries: 2,
      maxRequestsPerMinute: 10,
    });

    return this;
  }

  async parse() {
    log.info("Adding requests to the queue.");

    const models = await OppoAPI.getModels();
    const locales = await this.getLocales();

    await this.parseManuals(models, locales);
  }

  async getLocales() {
    let locales;

    try {
      locales = await state.serializer.load("locales");
    } catch (err) {
      await this.crawler.run([
        {
          url: `${this.baseURL}/en/choose-site/`,
          label: "LOCALES",
        },
      ]);

      locales = await state.serializer.load("locales");
    }

    return locales;
  }

  async parseManuals(models, locales) {
    for (const locale in locales) {
      const language = locales[locale];

      await this.playwrightCrawler.run([
        {
          url: `https://support.oppo.com/${locale}/user-guide`,
          label: "SERIES",
          userData: { data: { language, models } },
        },
      ]);
    }
  }

  /*
  async parseManuals(models, locales) {
    const targets = [];

    for (const locale in locales) {
      const language = locales[locale];

      targets.push({
        url: `https://support.oppo.com/${locale}/user-guide`,
        label: "SERIES",
        userData: { data: { language, models } },
      });
    }

    await this.playwrightCrawler.run(targets);
  }
  */

  async start() {
    await this.parseDecorator(this.parse.bind(this));
  }
}
