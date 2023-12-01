import { snakeCase } from "snake-case";

export class Statistic {
  #products = {
    insertedCount: 0,
    updatedCount: 0,
  };

  #manuals = {
    insertedCount: 0,
    updatedCount: 0,
  };

  #productsManuals = {
    insertedCount: 0,
  };

  get products() {
    return this.#products;
  }

  get manuals() {
    return this.#manuals;
  }

  get productsManuals() {
    return this.#productsManuals;
  }

  increment(entity, type) {
    this[`${entity}`][`${type}Count`]++;
  }

  print() {
    ["products", "manuals", "productsManuals"].forEach((entity) => {
      const insertedCount = this[entity].insertedCount;

      if (insertedCount > 0) {
        console.log(
          `Inserted ${insertedCount} records to table "${snakeCase(entity)}".`
        );
      }

      const updatedCount = this[entity].updatedCount || 0;

      if (updatedCount > 0) {
        console.log(
          `Updated ${updatedCount} records to table "${snakeCase(entity)}".`
        );
      }
    });
  }
}
