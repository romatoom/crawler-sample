import { log } from "crawlee";
import { getPreparedData, getPreparedDataWithRange } from "#utils/data_preparer.js";
import { settings } from "#utils/globals.js";
import { exportStatistic } from "#utils/statistics.js";
import { pathOfEntityDataset } from "#utils/paths.js";

import * as fs from "node:fs/promises";

import {
  prepareSqliteDBFile,
  openDatabase,
  findProductId,
  findManualId,
  findProductManualId,
} from "./database.js";

log.setLevel(log.LEVELS.INFO);

let sql;
let db;

// Insert or update products to DB
async function exportProducts(db, products) {
  log.info(`Export products.`);
  for (const product of products) {
    // if (!product.brand) product.brand = "";
    const metadata = product.metadata || {};
    const description = product.description || null;
    const productId = await findProductId(db, product);
    const sku = product.sku || null;

    // Update row, if product exist in DB
    if (productId) {
      sql =
        "UPDATE products SET brand = ?, category = ?, url = ?, specs = json(?), images = json(?), metadata = json(?), description = ?, sku = ? WHERE id = ?";

      const values = [
        product.brand,
        product.category,
        product.url,
        JSON.stringify(product.specs),
        JSON.stringify(product.images),
        JSON.stringify(metadata),
        description,
        sku,
        productId,
      ];

      await db.run(sql, values, function (err) {
        if (err) return log.error(err.message);
      });

      exportStatistic.incrementUpdatedProducts();
    } else {
      // Insert row, if product not exist in DB
      sql = `INSERT INTO products(brand, category, name, url, specs, images, metadata, description, sku) VALUES (?, ?, ?, ?, json(?), json(?), json(?), ?, ?)`;

      const values = [
        product.brand,
        product.category,
        product.name,
        product.url,
        JSON.stringify(product.specs),
        JSON.stringify(product.images),
        JSON.stringify(metadata),
        description,
        sku,
      ];

      await db.run(sql, values, (err) => {
        if (err) return log.error(err.message);
      });

      exportStatistic.incrementInsertedProducts();
    }
  }
}

// Insert or update manuals to DB
async function exportManuals(db, manuals) {
  log.info(`Export manuals.`);

  for (const manual of manuals) {
    const manualId = await findManualId(db, manual);

    const metadata = manual.metadata || {};

    // Update row, if manual exist in DB
    if (manualId) {
      sql =
        "UPDATE manuals SET material_type = ?, title = ?, languages = json(?), metadata = json(?) WHERE id = ?";

      const values = [
        manual.materialType,
        manual.title,
        JSON.stringify(manual.languages),
        JSON.stringify(metadata),
        manualId,
      ];

      await db.run(sql, values, function (err) {
        if (err) return log.error(err.message);
      });

      exportStatistic.incrementUpdatedManuals();
    } else {
      // Insert row, if maniual not exist in DB
      sql = `INSERT INTO manuals(material_type, pdf_url, title, languages, metadata) VALUES (?, ?, ?, json(?), json(?))`;

      const values = [
        manual.materialType,
        manual.pdfUrl,
        manual.title,
        JSON.stringify(manual.languages),
        JSON.stringify(metadata),
      ];

      await db.run(sql, values, (err) => {
        if (err) return log.error(err.message);
      });

      exportStatistic.incrementInsertedManuals();
    }
  }
}

// Insert products_manuals to DB
async function exportProductsManuals(db, products, manuals, productsManuals) {
  log.info(`Export products_manuals.`);

  for (const productManual of productsManuals) {
    const product = products.find((p) => p.innerId === productManual.productId);
    if (!product) {
      log.error(`Product with id = ${productManual.productId} not found!`);
    }
    const productId = await findProductId(db, product);

    const manual = manuals.find((m) => m.innerId === productManual.manualId);
    if (!manual) {
      log.error(`Manual with id = ${productManual.manualId} not found!`);
    }
    const manualId = await findManualId(db, manual);

    const productManualId = await findProductManualId(db, productId, manualId);

    if (!productManualId) {
      sql = `INSERT INTO products_manuals(product_id, manual_id) VALUES (?, ?)`;

      const values = [productId, manualId];

      await db.run(sql, values, (err) => {
        if (err) return log.error(err.message);
      });

      exportStatistic.incrementInsertedProductManuals();
    }
  }
}

export async function exportDataToSqlite(source = settings.source) {
  await prepareSqliteDBFile();

  const { products, manuals, productsManuals } = await getPreparedData();

  try {
    db = await openDatabase();
  } catch (err) {
    log.error("Error opening database", err);
    return;
  }

  log.info(`Start exporting data to SQLite ("${source.currentName}.db").`);

  try {
    await exportProducts(db, products);
    await exportManuals(db, manuals);
    await exportProductsManuals(db, products, manuals, productsManuals);

    exportStatistic.print();
  } catch (err) {
    log.error(err);
  }
}


export async function exportDataToSqliteWithRange(source = settings.source) {
  await prepareSqliteDBFile();

  try {
    db = await openDatabase();
  } catch (err) {
    log.error("Error opening database", err);
    return;
  }

  const LIMIT = 50000;

  const dirPath = pathOfEntityDataset("products_manuals");
  const productsManualsFiles = await fs.readdir(dirPath);

  let currProductManual = 0;

  while (currProductManual < productsManualsFiles.length) {
    const productsRange = {};
    const manualsRange = {};

    let next = currProductManual + LIMIT;
    if (next > productsManualsFiles.length) next = productsManualsFiles.length;

    const productsManualsRange = {
      start: currProductManual + 1,
      end: next,
    };

    for (const pos in productsManualsRange) {
      const productsManualsFileName =
        productsManualsFiles[productsManualsRange[pos] - 1];

      const rec = await fs.readFile(`${dirPath}/${productsManualsFileName}`, {
        encoding: "utf8",
      });

      const { productId, manualId } = JSON.parse(rec);

      productsRange[pos] = productId;
      manualsRange[pos] = manualId;
    }

    const { products, manuals, productsManuals } =
      await getPreparedDataWithRange(
        productsRange,
        manualsRange,
        productsManualsRange
      );

    log.info(`Start exporting data to SQLite ("${source.currentName}.db").`);

    try {
      await exportProducts(db, products);
      await exportManuals(db, manuals);
      await exportProductsManuals(db, products, manuals, productsManuals);

      exportStatistic.print();
    } catch (err) {
      log.error(err);
    }

    currProductManual = next;
  }
}
