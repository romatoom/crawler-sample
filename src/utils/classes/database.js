import fs from "fs";
import { copyFile } from "node:fs/promises";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

import state from "#utils/classes/state.js";

export class Database {
  static folder = "databases";
  // Call from Database.build(...)
  constructor(sourceName, db) {
    this.sourceName = sourceName;
    this.db = db;
  }

  static filePath(sourceName) {
    return `${Database.folder}/${sourceName}.db`;
  }

  static get emptyFilePath() {
    return `${Database.folder}/empty.db`;
  }

  static async build(sourceName) {
    await Database.createFromEmptyFile(sourceName);

    const db = await open({
      filename: Database.filePath(sourceName),
      driver: sqlite3.cached.Database,
    });

    return new Database(sourceName, db);
  }

  static async createFromEmptyFile(sourceName) {
    try {
      const dbFilenamePath = Database.filePath(sourceName);

      if (!fs.existsSync(dbFilenamePath)) {
        await copyFile(Database.emptyFilePath, dbFilenamePath);
      }
    } catch (err) {
      console.error(
        `Error while preparing database file "${sourceName}.db":`,
        err
      );
    }
  }

  async findProductId(product) {
    const findedProduct = await this.db.get(
      "SELECT id FROM products WHERE brand = ? AND name = ?",
      [product.data.brand, product.data.name]
    );

    return findedProduct?.id;
  }

  async findManualId(manual) {
    const findedManual = await this.db.get(
      "SELECT id FROM manuals WHERE pdf_url = ?",
      [manual.data.pdfUrl]
    );

    return findedManual?.id;
  }

  async findProductManualId(productId, manualId) {
    const findedProductManual = await this.db.get(
      "SELECT id FROM products_manuals WHERE product_id = ? AND manual_id = ?",
      [productId, manualId]
    );

    return findedProductManual?.id;
  }

  async updateProduct(productId, data) {
    const sql =
      "UPDATE products SET brand = ?, category = ?, url = ?, specs = json(?), images = json(?), metadata = json(?), description = ?, sku = ? WHERE id = ?";

    const values = [
      data.brand,
      data.category,
      data.url,
      JSON.stringify(data.specs),
      JSON.stringify(data.images),
      JSON.stringify(data.metadata),
      data.description,
      data.sku,
      productId,
    ];

    await this.db.run(sql, values);
    state.statistic.increment("products", "updated");
  }

  async insertProduct(data) {
    const sql = `INSERT INTO products(brand, category, name, url, specs, images, metadata, description, sku) VALUES (?, ?, ?, ?, json(?), json(?), json(?), ?, ?)`;

    const values = [
      data.brand,
      data.category,
      data.name,
      data.url,
      JSON.stringify(data.specs),
      JSON.stringify(data.images),
      JSON.stringify(data.metadata),
      data.description,
      data.sku,
    ];

    await this.db.run(sql, values);
    state.statistic.increment("products", "inserted");
  }

  async updateManual(manualId, data) {
    const sql =
      "UPDATE manuals SET material_type = ?, title = ?, languages = json(?), metadata = json(?) WHERE id = ?";

    const values = [
      data.materialType,
      data.title,
      JSON.stringify(data.languages),
      JSON.stringify(data.metadata),
      manualId,
    ];

    await this.db.run(sql, values);
    state.statistic.increment("manuals", "updated");
  }

  async insertManual(data) {
    const sql = `INSERT INTO manuals(material_type, pdf_url, title, languages, metadata) VALUES (?, ?, ?, json(?), json(?))`;

    const values = [
      data.materialType,
      data.pdfUrl,
      data.title,
      JSON.stringify(data.languages),
      JSON.stringify(data.metadata),
    ];

    await this.db.run(sql, values);
    state.statistic.increment("manuals", "inserted");
  }

  async insertProductManual(data) {
    const sql = `INSERT INTO products_manuals(product_id, manual_id) VALUES (?, ?)`;

    const values = [data.productId, data.manualId];

    await this.db.run(sql, values);
    state.statistic.increment("productsManuals", "updated");
  }

  async readRowsFromTable(tableName) {
    return this.db.all(`SELECT * FROM ${tableName}`);
  }

  /* destructor() {
    await this.db.close()
  };*/
}
