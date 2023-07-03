import { log } from "crawlee";
import { snakeCase } from "snake-case";

export const exportStatistic = {
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

  incrementInsertedProducts() {
    this.products.insertedCount++;
  },

  incrementUpdatedProducts() {
    this.products.updatedCount++;
  },

  incrementInsertedManuals() {
    this.manuals.insertedCount++;
  },

  incrementUpdatedManuals() {
    this.manuals.updatedCount++;
  },

  incrementInsertedProductManuals() {
    this.productsManuals.insertedCount++;
  },

  print() {
    log.info("Data exported successfully.");
    ["products", "manuals", "productsManuals"].forEach((entity) => {
      const insertedCount = this[entity].insertedCount;
      if (insertedCount > 0) {
        log.info(
          `Inserted ${insertedCount} records to table "${snakeCase(entity)}".`
        );
      }

      const updatedCount = this[entity].updatedCount || 0;
      if (updatedCount > 0) {
        log.info(
          `Updated ${updatedCount} records to table "${snakeCase(entity)}".`
        );
      }
    });
  },
};
