import fs from "fs";
import path from "path";
import { Router, log } from "crawlee";
import state from "#utils/classes/state.js";
import { Product } from "#utils/classes/product.js";
import { Manual } from "#utils/classes/manual.js";

export class Source {
  exportOptions = {};

  constructor() {
    this.router = Router.create();
  }

  async addRoutes() {
    for (const label of fs
      .readdirSync(`src/sources/${this.name}/routes`, { withFileTypes: true })
      .map((d) => path.parse(d.name).name)) {
      const { default: routeHandler } = await import(
        `#sources/${this.name}/routes/${label}.js`
      );

      this.router.addHandler(label.toUpperCase(), routeHandler(this));
    }
  }

  async startDecorator() {
    await state.storage.dropDatasets();

    Product.lastInnerId = await state.serializer.load("lastInnerIdProduct");
    Manual.lastInnerId = await state.serializer.load("lastInnerIdManual");

    await this.parse();

    await state.storage.exportDatasets();
    await state.exporter.export();
  }
}
