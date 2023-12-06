import state from "#utils/classes/state.js";

import * as fs from "node:fs/promises";

export class Exporter {
  static PART_LIMIT = 2000;
  static MIN_PART_LIMIT = 2000;

  constructor(source, db) {
    this.source = source;
    this.db = db;
  }

  async exportProducts(products) {
    console.log(`Export products.`);

    for (const product of products) {
      const data = { ...product.data };

      data.metadata = data.metadata || {};
      data.description = data.description || null;
      data.sku = data.sku || null;
      data.images = data.images || [];
      data.specs = data.specs || [];
      data.url = data.url || null;

      const productId = await this.db.findProductId(product);

      if (productId) {
        await this.db.updateProduct(productId, data);
      } else {
        await this.db.insertProduct(data);
      }
    }
  }

  async exportManuals(manuals) {
    console.log(`Export manuals.`);

    for (const manual of manuals) {
      const data = { ...manual.data };

      data.metadata = data.metadata || {};

      const manualId = await this.db.findManualId(manual);

      if (manualId) {
        await this.db.updateManual(manualId, data);
      } else {
        await this.db.insertManual(data);
      }
    }
  }

  async exportProductsManuals(products, manuals, productsManuals) {
    console.log(`Export products_manuals.`);

    for (const productManual of productsManuals) {
      const product = products.find(
        (p) => p.data.innerId === productManual.data.productId
      );

      if (!product) {
        console.error(
          `Product with id = ${productManual.data.productId} not found!`
        );
      }

      const productId = await this.db.findProductId(product);

      const manual = manuals.find(
        (m) => m.data.innerId === productManual.data.manualId
      );

      if (!manual) {
        console.error(
          `Manual with id = ${productManual.data.manualId} not found!`
        );
      }

      const manualId = await this.db.findManualId(manual);

      const productManualId = await this.db.findProductManualId(
        productId,
        manualId
      );

      if (!productManualId) {
        await this.db.insertProductManual({ productId, manualId });
      }
    }
  }

  async export() {
    let partLimit;

    if (
      this.source.exportOptions.partLimit &&
      this.source.exportOptions.partLimit < Exporter.MIN_PART_LIMIT
    ) {
      partLimit = Exporter.MIN_PART_LIMIT;

      /* return console.error(
        `Минимальный размер части составляет ${Exporter.MIN_PART_LIMIT}.`
      ); */
    }

    console.log(`Start exporting data to SQLite ("${this.source.name}.db").`);

    if (partLimit) {
      await this.exportDataToSqliteWithRange(partLimit);
    } else {
      const { products, manuals, productsManuals } =
        await state.dataPreparer.getPreparedData();

      console.log("Export start");

      await this.exportPart(products, manuals, productsManuals);
    }

    console.log("Data exported successfully.");

    state.statistic.print();
  }

  async exportPart(products, manuals, productsManuals) {
    try {
      await this.exportProducts(products);
      await this.exportManuals(manuals);
      await this.exportProductsManuals(products, manuals, productsManuals);
    } catch (err) {
      console.error(err);
    }
  }

  async exportDataToSqliteWithRange(limit = Exporter.PART_LIMIT) {
    console.log(`Export with part limit ${limit} start`);

    const dirPath = state.paths.pathOfEntityDataset("products_manuals");
    const productsManualsFiles = await fs.readdir(dirPath);

    let currProductManual = 0;

    while (currProductManual < productsManualsFiles.length) {
      const productsRange = [];
      const manualsRange = [];
      const productsManualsRange = [];

      let next = currProductManual + limit;

      if (next > productsManualsFiles.length)
        next = productsManualsFiles.length;

      const start = currProductManual + 1;
      const end = next;

      for (let i = start; i <= end; i++) {
        const productsManualsFileName = productsManualsFiles[i - 1];

        const rec = await fs.readFile(`${dirPath}/${productsManualsFileName}`, {
          encoding: "utf8",
        });

        const { productId, manualId } = JSON.parse(rec);

        if (!productsRange.includes(productId)) productsRange.push(productId);
        if (!manualsRange.includes(manualId)) manualsRange.push(manualId);

        productsManualsRange.push(i);
      }

      const preparedData = await state.dataPreparer.getPreparedData(
        productsRange,
        manualsRange,
        productsManualsRange
      );

      await this.exportPart(...Object.values(preparedData));

      currProductManual = next;
    }
  }
}
