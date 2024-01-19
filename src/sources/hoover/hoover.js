import { CheerioCrawler, log } from "crawlee";

import { Source } from "#utils/classes/source.js";

import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

import { HooverAPI } from "./api.js";

import state from "#utils/classes/state.js";

export default class LenovoSource extends Source {
  baseURL = "https://hoover.com";
  brand = "Hoover";
  name = "hoover";

  categories = {
    293260951703:
      "https://hoover.com/collections/hoover-commercial-upright-vacuums",
    293221007511:
      "https://hoover.com/collections/commercial-backpacks-and-canisters",
    293221040279: "https://hoover.com/collections/commercial-cordless",
    293221073047:
      "https://hoover.com/collections/commercial-specialty-products",
    293228445847:
      "https://hoover.com/collections/commercial-parts-and-accessories",
    278914465943: "https://hoover.com",
    261650415767: "https://hoover.com",
    289304739991: "https://hoover.com/collections/value-bundles",
  };

  types = {
    "PRODUCT MANUAL": "Product Manual",
    "QUICK START GUIDE": "Quick Start Guide",
    "INGREDIENT LIST": "Ingredient List",
    "SAFETY DATA SHEET": "Safety Data Sheet",
  };

  langs = {
    ENGLISH: "English",
    SPANISH: "Spanish",
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
      maxConcurrency: 3,
      maxRequestRetries: 2,
      maxRequestsPerMinute: 60,
    });

    return this;
  }

  async parse() {
    log.info("Adding requests to the queue.");

    const products = await HooverAPI.getProducts(this.categories);

    let productURLsSuccessed;
    try {
      productURLsSuccessed = await state.serializer.load(
        "productURLsSuccessed",
        {
          append: true,
        }
      );
    } catch (err) {
      productURLsSuccessed = [];
    }

    const targets = products
      .filter((p) => !productURLsSuccessed.includes(p.url))
      .map((p) => ({
        url: p.url.replaceAll(" ", "%20"),
        label: "PRODUCT",
        userData: {
          data: {
            name: p.name,
            description: p.description,
            image: p.image,
            sku: p.sku,
            category: p.category,
          },
        },
      }));

    await this.crawler.run(targets);
  }

  async start() {
    await this.parseDecorator(this.parse.bind(this), {
      // onlyParse: true,
      // dropDatasets: false,
    });
  }
}
