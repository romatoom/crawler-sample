import fs from "fs";
import sqlite3 from "sqlite3";
import { copyFile } from "node:fs/promises";
import { open } from "sqlite";
import { log } from "crawlee";
import { snakeCase } from "snake-case";
import getPreparedData from "#utils/data_preparer.js";
import {
  MI_FORMATTERS,
  CENTRAL_MANUALS_FORMATTERS,
} from "#utils/formatters.js";

log.setLevel(log.LEVELS.INFO);

let sql;
let db;

async function prepareSqliteDBFile(sourceName) {
  try {
    const dbFilenamePath = `databases/${sourceName}.db`;

    if (!fs.existsSync(dbFilenamePath)) {
      await copyFile("databases/empty.db", dbFilenamePath);
    }
  } catch (err) {
    log.error(`Error while preparing database file "${sourceName}.db":`, err);
  }
}

function productsManualsReferences(products, manuals, sourceName) {
  function productNameContainsInManualTitle(product, manual) {
    switch (sourceName) {
      case "mi":
        return (
          product.name.toLowerCase() ===
          MI_FORMATTERS.cleanedManualTitle(manual.title).toLowerCase()
        );
      case "central-manuals":
        const { productName, brand } =
          CENTRAL_MANUALS_FORMATTERS.infoByManualTitle(manual.title);

        const productNames = productName.split(" / ");

        return productNames.includes(product.name) && product.brand === brand;
      default:
        return false;
    }
  }

  log.info(`Prepare products-manuals references.`);

  const references = [];

  for (const [productIndex, product] of products.entries()) {
    for (const [manualIndex, manual] of manuals.entries()) {
      if (productNameContainsInManualTitle(product, manual)) {
        references.push({
          product_id: productIndex + 1,
          manual_id: manualIndex + 1,
        });
      }
    }
  }

  return references;
}

export default async function exportDataToSqlite(sourceName) {
  await prepareSqliteDBFile(sourceName);

  log.info(`Start exporting data to SQLite ("${sourceName}.db").`);

  const { products, manuals } = await getPreparedData(sourceName);

  try {
    db = await open({
      filename: `databases/${sourceName}.db`,
      driver: sqlite3.cached.Database,
    });
  } catch (err) {
    return log.error(err.message);
  }

  const exportStatistic = {
    products: {
      insertedCount: 0,
      updatedCount: 0,
    },

    manuals: {
      insertedCount: 0,
      updatedCount: 0,
    },

    productsManuals: {
      insertedCount: 0,
    },
  };

  try {
    // Insert or update products to DB

    log.info(`Export products.`);
    for (const product of products) {
      sql = "SELECT id FROM products WHERE brand = ? AND name = ?";

      // Find product
      const productId = await db.get(
        sql,
        [product.brand, product.name],
        (err, row) => {
          if (err) {
            return console.error(err.message);
          }
          return row?.id;
        }
      );

      // Update row, if product exist in DB
      if (productId) {
        sql =
          "UPDATE products SET brand = ?, category = ?, url = ?, specs = json(?), images = json(?) WHERE id = ?";

        const values = [
          product.brand,
          product.category,
          product.url,
          JSON.stringify(product.specs),
          JSON.stringify(product.images),
          productId,
        ];

        await db.run(sql, values, function (err) {
          if (err) return log.error(err.message);
        });

        exportStatistic.products.updatedCount++;
      } else {
        // Insert row, if product not exist in DB
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
          if (err) return log.error(err.message);
        });

        exportStatistic.products.insertedCount++;
      }
    }

    log.info(`Export manuals.`);
    // Insert or update manuals to DB
    for (const manual of manuals) {
      sql = "SELECT id FROM manuals WHERE pdf_url = ?";

      // Find manual
      const manualId = await db.get(sql, [manual.pdfUrl], (err, row) => {
        if (err) {
          return console.error(err.message);
        }
        return row?.id;
      });

      // Update row, if manual exist in DB
      if (manualId) {
        sql =
          "UPDATE manuals SET material_type = ?, title = ?, languages = json(?) WHERE id = ?";

        const values = [
          manual.materialType,
          manual.title,
          JSON.stringify(manual.languages),
          manualId,
        ];

        await db.run(sql, values, function (err) {
          if (err) return log.error(err.message);
        });

        exportStatistic.manuals.updatedCount++;
      } else {
        // Insert row, if maniual not exist in DB
        sql = `INSERT INTO manuals(material_type, pdf_url, title, languages) VALUES (?, ?, ?, json(?))`;

        const values = [
          manual.materialType,
          manual.pdfUrl,
          manual.title,
          JSON.stringify(manual.languages),
        ];

        await db.run(sql, values, (err) => {
          if (err) return log.error(err.message);
        });

        exportStatistic.manuals.insertedCount++;
      }
    }

    const dbProducts = await db.all("SELECT * FROM products", (err, rows) => {
      if (err) {
        return log.error(err);
      }
      return rows;
    });

    const dbManuals = await db.all("SELECT * FROM manuals", (err, rows) => {
      if (err) {
        return log.error(err);
      }
      return rows;
    });

    // get productsManuals references;
    const productsManuals = productsManualsReferences(
      dbProducts,
      dbManuals,
      sourceName
    );

    log.info(`Export products_manuals.`);
    // Insert products_manuals to DB
    for (const productManual of productsManuals) {
      sql =
        "SELECT id FROM products_manuals WHERE product_id = ? AND manual_id = ?";

      // Find manual
      const productManualId = await db.get(
        sql,
        [productManual.product_id, productManual.manual_id],
        (err, row) => {
          if (err) {
            return console.error(err.message);
          }
          return row?.id;
        }
      );

      if (!productManualId) {
        sql = `INSERT INTO products_manuals(product_id, manual_id) VALUES (?, ?)`;

        const values = [productManual.product_id, productManual.manual_id];

        await db.run(sql, values, (err) => {
          if (err) return log.error(err.message);
        });

        exportStatistic.productsManuals.insertedCount++;
      }
    }

    log.info("Data exported successfully.");
    ["products", "manuals", "productsManuals"].forEach((entity) => {
      const insertedCount = exportStatistic[entity].insertedCount;
      if (insertedCount > 0) {
        log.info(
          `Inserted ${insertedCount} records to table "${snakeCase(entity)}".`
        );
      }

      const updatedCount = exportStatistic[entity].updatedCount || 0;
      if (updatedCount > 0) {
        log.info(
          `Updated ${updatedCount} records to table "${snakeCase(entity)}".`
        );
      }
    });
  } catch (err) {
    log.error(err.message);
  } finally {
    db.close();
  }
}
