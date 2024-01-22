import { CheerioCrawler, log } from "crawlee";

import { Source } from "#utils/classes/source.js";
import state from "#utils/classes/state.js";

import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

export default class SpykerWorkshopSource extends Source {
  baseURL = "https://spykerworkshop.com";
  brand = "Spyker Workshop";
  name = "spykerworkshop";

  joinTitles = BASE_MANUAL_TITLE_JOINER;

  types = {
    GUIDE: "Guide",
    "INSTRUCTION MANUAL": "Instruction Manual",
  };

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
      //maxRequestsPerMinute: 60,
    });

    return this;
  }

  async parse() {
    log.info("Adding requests to the queue.");

    await this.crawler.run([
      {
        url: `${this.baseURL}/shop`,
        label: "SHOP",
      },
    ]);
  }

  async start() {
    await this.parseDecorator(this.parse.bind(this), {
      // onlyParse: true,
      // dropDatasets: false,
    });
  }
}
