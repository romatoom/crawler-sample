import {
  getPreparedData,
  getPreparedDataWithRange,
} from "#utils/data_preparer.js";

import { pathOfEntityDataset } from "#utils/paths.js";

import { Product } from "#utils/classes/product.js";
import { Manual } from "#utils/classes/manual.js";
import { ProductManual } from "#utils/classes/productManual.js";

import state from "#utils/classes/state.js";

import * as fs from "node:fs/promises";

export class Exporter {
  static PART_LIMIT = 2;
  static MIN_PART_LIMIT = 2;

  constructor(sourceName, db) {
    this.sourceName = sourceName;
    this.db = db;
  }

  async exportProducts(products) {
    console.log(`Export products.`);

    for (const product of products) {
      const data = { ...product.data };

      data.metadata = data.metadata || {};
      data.description = data.description || null;
      data.sku = data.sku || null;

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

  async export(options = {}) {
    if (options.partLimit && options.partLimit < Exporter.MIN_PART_LIMIT) {
      return console.error(
        `Минимальный размер части составляет ${Exporter.MIN_PART_LIMIT}.`
      );
    }

    console.log(`Start exporting data to SQLite ("${this.sourceName}.db").`);

    if (options.partLimit) {
      await this.exportDataToSqliteWithRange(options.partLimit);
    } else {
      const { products, manuals, productsManuals } = await getPreparedData();
      await this.exportPart(products, manuals, productsManuals);
    }

    console.log("Data exported successfully.");

    state.statistic.print();
  }

  async exportPart(productsData, manualsData, productsManualsData) {
    const products = productsData.map((data) => new Product(data));
    const manuals = manualsData.map((data) => new Manual(data));
    const productsManuals = productsManualsData.map(
      (data) => new ProductManual(data)
    );

    try {
      await this.exportProducts(products);
      await this.exportManuals(manuals);
      await this.exportProductsManuals(products, manuals, productsManuals);
    } catch (err) {
      console.error(err);
    }
  }

  async exportDataToSqliteWithRange(limit = Exporter.PART_LIMIT) {
    const dirPath = pathOfEntityDataset("products_manuals");
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

      const preparedData = await getPreparedDataWithRange(
        productsRange,
        manualsRange,
        productsManualsRange
      );

      await this.exportPart(...Object.values(preparedData));

      currProductManual = next;
    }
  }
}
