import { CheerioCrawler, log } from "crawlee";

import { Source } from "#utils/classes/source.js";

import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

import { GenesisAPI } from "./api.js";

import { Helper } from "#utils/classes/helper.js";

import state from "#utils/classes/state.js";
import { Manual } from "#utils/classes/manual.js";

export default class GenesisSource extends Source {
  baseURL = "https://www.genesis.com";
  manualsURL = "https://owners.genesis.com";

  brand = "Genesis";
  name = "genesis";
  category = "Vehicles";

  materialTypes = [
    "Owner's Manual",
    "Owner’s Manual",
    "Getting Started Guide",
    "Navigation Manual",
    "Quick Reference Guide",
    "Quick Start Guide",
    "Multimedia User’s Manual",
    "User's Manual",
    "Owners Manual",
    "Simple Manual",
    "Phone Projection Guide",
  ];

  joinTitles = BASE_MANUAL_TITLE_JOINER;

  /* exportOptions = {
    partLimit: ...
  }; */

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

    await this.parseProducts();
    await this.parseManuals();
  }

  async parseProducts() {
    await this.crawler.run([
      {
        url: `${this.baseURL}/us/en/home`,
        label: "PRODUCTS",
      },
    ]);
  }

  async parseManuals() {
    let manuals;

    try {
      manuals = await state.serializer.load("manuals");
    } catch {
      manuals = await GenesisAPI.getManuals(this.manualsURL);
      await state.serializer.dump({ manuals });
    }

    for (const manualItem of manuals) {
      const manual = new Manual({
        materialType: Helper.arrayItemsInString(
          manualItem.leadText,
          this.materialTypes,
          "Manual"
        ),
        pdfUrl: `${this.manualsURL}${manualItem.href}`,
        title: manualItem.leadText,
        language: "English",
        metadata: {
          description: manualItem.description,
          size: manualItem.size,
        },
      });

      await state.storage.pushData(manual);
    }
  }

  async start() {
    await this.parseDecorator(this.parse.bind(this), { dropDatasets: true });
  }

  referenceExist(product, manual) {
    return manual.data.title.startsWith(product.data.name);
  }

  pseudoProductDataForManual(manual) {
    const regexp = /^(20[0-9]{2} ((Genesis )|(Electrified ))?GV?[0-9]{2}).+/;

    const matches = regexp.exec(manual.data.title);
    if (!matches) return;

    return {
      name: matches[1],
      brand: this.brand,
      category: this.category,
    };
  }
}
