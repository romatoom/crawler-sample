import fs from "fs";
import path from "path";
import { Router } from "crawlee";
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

  async parseDecorator(
    parseFunc,
    options = { dropDatasets: true, onlyParse: false }
  ) {
    options.dropDatasets = options.dropDatasets ?? true;
    options.onlyParse = options.onlyParse ?? false;

    if (options.dropDatasets) {
      await state.storage.dropDatasets();
    } else {
      try {
        Product.lastInnerId = await state.serializer.load("lastInnerIdProduct");
        Manual.lastInnerId = await state.serializer.load("lastInnerIdManual");
      } catch (e) {
        await Promise.all([
          state.serializer.dump({
            lastInnerIdProduct: 0,
          }),
          state.serializer.dump({
            lastInnerIdManual: 0,
          }),
        ]);
      }
    }

    await parseFunc();
    if (options.onlyParse) return;

    await state.storage.exportDatasets();
    await state.exporter.export();
  }
}
