import { log } from "crawlee";
import { snakeCase } from "snake-case";
import getPreparedData from "#utils/data_preparer.js";
import varSave from "#utils/var_saver.js";

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

export default async function exportDataToSqlite(sourceName) {
  await prepareSqliteDBFile(sourceName);

  const { products, manuals, productsManuals } = await getPreparedData(
    sourceName
  );

  varSave(products, "products", sourceName);
  varSave(manuals, "manuals", sourceName);
  varSave(productsManuals, "productsManuals", sourceName);

  try {
    db = await openDatabase(sourceName);
  } catch (err) {
    console.log("Error opening database", err);
    return;
  }

  log.info(`Start exporting data to SQLite ("${sourceName}.db").`);

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
      const productId = await findProductId(db, product);

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
      const manualId = await findManualId(db, manual);

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

    log.info(`Export products_manuals.`);
    // Insert products_manuals to DB
    for (const productManual of productsManuals) {
      const product = products.find(
        (p) => p.innerId === productManual.productId
      );
      if (!product) {
        console.error("product id:", productManual.productId);
      }
      const productId = await findProductId(db, product);

      const manual = manuals.find((m) => m.innerId === productManual.manualId);
      if (!manual) {
        console.error("manual id:", productManual.manualId);
      }
      const manualId = await findManualId(db, manual);

      const productManualId = await findProductManualId(
        db,
        productId,
        manualId
      );

      if (!productManualId) {
        sql = `INSERT INTO products_manuals(product_id, manual_id) VALUES (?, ?)`;

        const values = [productId, manualId];

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
    log.error(err);
  }
}
