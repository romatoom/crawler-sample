import { snakeCase } from "snake-case";

export class Statistic {
  #products = {
    insertedIDs: new Set(),
    updatedIDs: new Set(),
  };

  #manuals = {
    insertedIDs: new Set(),
    updatedIDs: new Set(),
  };

  #productsManuals = {
    insertedIDs: new Set(),
    updatedIDs: new Set(),
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

  increment(entity, type, id) {
    this[`${entity}`][`${type}IDs`].add(id);
  }

  print() {
    ["products", "manuals", "productsManuals"].forEach((entity) => {
      const insertedCount = [...this[entity].insertedIDs].length;

      if (insertedCount > 0) {
        console.log(
          `Inserted ${insertedCount} records to table "${snakeCase(entity)}".`
        );
      }

      const updatedCount = [...this[entity].updatedIDs].length;

      if (updatedCount > 0) {
        console.log(
          `Records from table "${snakeCase(
            entity
          )}" updated ${updatedCount} times.`
        );
      }
    });
  }
}
