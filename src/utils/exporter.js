import fs from "fs";
import { copyFile } from "node:fs/promises";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { log } from "crawlee";

import {
  PATH_OF_PREPARED_MANUALS,
  PATH_OF_PREPARED_PRODUCTS,
  PATH_OF_PREPARED_PRODUCTS_MANUALS,
} from "#sources/mi/constants.js";

log.setLevel(log.LEVELS.INFO);

const sqlite = sqlite3.verbose();

let sql;
let db;

async function recreateSqliteDBFile() {
  try {
    await copyFile("databases/empty.db", "databases/mi.db");
  } catch (err) {
    log.error("Error while recreating database file:", err);
  }
}

function readJSONData() {
  let rawData = fs.readFileSync(PATH_OF_PREPARED_PRODUCTS);
  const products = JSON.parse(rawData);

  rawData = fs.readFileSync(PATH_OF_PREPARED_MANUALS);
  const manuals = JSON.parse(rawData);

  rawData = fs.readFileSync(PATH_OF_PREPARED_PRODUCTS_MANUALS);
  const productsManuals = JSON.parse(rawData);

  return {
    products,
    manuals,
    productsManuals,
  };
}

export default async function exportDataToSqlite() {
  log.info("Start exporting data to SQLite.");

  await recreateSqliteDBFile();

  const { products, manuals, productsManuals } = readJSONData();

  try {
    db = await open({
      filename: "databases/mi.db",
      driver: sqlite3.cached.Database,
    });
  } catch (err) {
    return log.error(err.message);
  }

  try {
    // Insert products to DB
    for (const product of products) {
      sql = `INSERT INTO products(brand, category, name, url, specs, images) VALUES (?, ?, ?, ?, json(?), json(?))`;

      const values = [
        product.brand,
        product.category,
        product.name,
        product.url,
        JSON.stringify(product.specs),
        JSON.stringify(product.images),
      ];

      await db.run(sql, values, (err) => {
        if (err) log.error(err.message);
      });
    }

    // Insert manuals to DB
    for (const manual of manuals) {
      sql = `INSERT INTO manuals(material_type, pdf_url, title, languages) VALUES (?, ?, ?, json(?))`;

      const values = [
        manual.materialType,
        manual.pdfUrl,
        manual.title,
        JSON.stringify(manual.languages),
      ];

      await db.run(sql, values, (err) => {
        if (err) log.error(err.message);
      });
    }

    // Insert products_manuals to DB
    for (const productManual of productsManuals) {
      sql = `INSERT INTO products_manuals(product_id, manual_id) VALUES (?, ?)`;

      const values = [productManual.product_id, productManual.manual_id];

      await db.run(sql, values, (err) => {
        if (err) log.error(err.message);
      });
    }

    log.info("Data exported successfully.");
  } catch (err) {
    log.error(err.message);
  } finally {
    db.close();
  }
}
