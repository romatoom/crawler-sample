import { CheerioCrawler, log } from "crawlee";
import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";
import { KwiksetAPI } from "./api.js";

import { Source } from "#utils/classes/source.js";
import state from "#utils/classes/state.js";
import flatten from "lodash/flatten.js";

export default class KwiksetSource extends Source {
  baseURL = "https://www.kwikset.com";
  brand = "Kwikset";
  name = "kwikset";

  types = [
    "Installation Guide",
    "Troubleshooting Guide",
    "Instruction Sheet",
    "Supporting Douments",
    "User Guide",
    "Instructions",
    "Compatibility Chart",
  ];

  langs = {
    English: "English",
    Spanish: "Español",
  };

  joinTitles = BASE_MANUAL_TITLE_JOINER;

  constructor() {
    super();
  }

  async init() {
    await this.addRoutes();

    log.info(`Setting up crawler for "${this.baseURL}"`);

    this.crawler = new CheerioCrawler({
      requestHandler: this.router,
      minConcurrency: 1,
      maxConcurrency: 5,
      maxRequestsPerMinute: 60,
    });

    return this;
  }

  async parse() {
    log.info("Adding requests to the queue.");

    let categories;
    await this.parseCategories();
    try {
      categories = await state.serializer.load("categories");
    } catch (err) {
      await this.parseCategories();
      categories = await state.serializer.load("categories");
    }

    let productsData;
    try {
      productsData = await state.serializer.load("productsData");
    } catch (err) {
      const promises = categories.map((category) =>
        KwiksetAPI.getProductsForCategory(category)
      );

      productsData = flatten(await Promise.all(promises));

      await state.serializer.dump({ productsData });
    }

    await this.parseProducts(productsData);
  }

  async parseCategories() {
    await this.crawler.run([
      {
        url: `${this.baseURL}/products`,
        label: "CATEGORIES",
      },
    ]);
  }

  async parseProducts(productsData) {
    const productsTargets = productsData.map((p) => ({
      url: `${this.baseURL}/products/detail/${p.slug}`,
      label: "PRODUCT",
      userData: {
        data: {
          displayName: p.displayName,
          series: p.series,
          primaryImage: p.primaryImage,
          category: p.category,
        },
      },
    }));

    await this.crawler.run(productsTargets);
  }

  async start() {
    await this.parseDecorator(this.parse.bind(this), {
      // onlyParse: true,
    });
  }
}
