import fs from "fs";
import { copyFile } from "node:fs/promises";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { log } from "crawlee";

export async function prepareSqliteDBFile(sourceName) {
  try {
    const dbFilenamePath = `databases/${sourceName}.db`;

    if (!fs.existsSync(dbFilenamePath)) {
      await copyFile("databases/empty.db", dbFilenamePath);
    }
  } catch (err) {
    log.error(`Error while preparing database file "${sourceName}.db":`, err);
  }
}

export async function openDatabase(sourceName) {
  log.info(`Open database ("${sourceName}.db")!`);

  const db = await open({
    filename: `databases/${sourceName}.db`,
    driver: sqlite3.cached.Database,
  });

  return db;
}

export async function findProductId(db, product) {
  const sql = "SELECT id FROM products WHERE brand = ? AND name = ?";

  const findedProduct = await db.get(
    sql,
    [product.brand, product.name],
    (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      return row?.id;
    }
  );

  return findedProduct?.id;
}

export async function findManualId(db, manual) {
  const sql = "SELECT id FROM manuals WHERE pdf_url = ?";

  // Find manual
  const findedManual = await db.get(sql, [manual.pdfUrl], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    return row?.id;
  });

  return findedManual?.id;
}

export async function findProductManualId(db, productId, manualId) {
  const sql =
    "SELECT id FROM products_manuals WHERE product_id = ? AND manual_id = ?";

  const findedProductManual = await db.get(
    sql,
    [productId, manualId],
    (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      return row?.id;
    }
  );

  return findedProductManual?.id;
}

export async function readProducts(sourceName) {
  const db = await openDatabase(sourceName);

  const dbProducts = await db.all("SELECT * FROM products", (err, rows) => {
    if (err) {
      throw err;
    }
    return rows;
  });

  return dbProducts;
}