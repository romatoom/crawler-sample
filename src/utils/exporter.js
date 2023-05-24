import fs from "fs";
import { copyFile } from "node:fs/promises";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

import {
  PATH_OF_PREPARED_MANUALS,
  PATH_OF_PREPARED_PRODUCTS,
  PATH_OF_PREPARED_PRODUCTS_MANUALS,
} from "../constants.js";

const sqlite = sqlite3.verbose();

let sql;
let db;

async function recreateSqliteDBFile() {
  try {
    await copyFile("databases/empty.db", "databases/mi.db");
  } catch (err) {
    console.log("Error while recreating database file:", err);
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
  await recreateSqliteDBFile();

  console.log("Start exporting data to SQLite");

  const { products, manuals, productsManuals } = readJSONData();

  try {
    db = await open({
      filename: "databases/mi.db",
      driver: sqlite3.cached.Database,
    });

    console.log("DB opened");
  } catch (err) {
    return console.error(err.message);
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
        if (err) console.error(err.message);
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
        if (err) console.error(err.message);
      });
    }

    // Insert products_manuals to DB
    for (const productManual of productsManuals) {
      sql = `INSERT INTO products_manuals(product_id, manual_id) VALUES (?, ?)`;

      const values = [productManual.product_id, productManual.manual_id];

      await db.run(sql, values, (err) => {
        if (err) console.error(err.message);
      });
    }

    console.log("Data inserted to DB");
  } catch (err) {
    console.error(err.message);
  } finally {
    db.close();
  }
}
