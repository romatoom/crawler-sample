import { Dataset } from "crawlee";
import state from "#utils/classes/state.js";

export class Storage {
  constructor(sourceName) {
    this.sourceName = sourceName;
    this.datasets = {
      products: undefined,
      manuals: undefined,
      products_manuals: undefined,
    };
  }

  async pushData(entity) {
    if (!this.sourceName) {
      return new Error("Need set source name");
    }

    this.datasets[entity.datasetName] ||= await Dataset.open(
      `${this.sourceName}/${entity.datasetName}`
    );

    await this.datasets[entity.datasetName].pushData(entity.data);

    await entity.constructor.saveLastInnerId(entity);
  }

  async exportDatasets() {
    console.log("Export datasets.");

    for (const datasetName of ["manuals", "products", "products_manuals"]) {
      console.log(`Export datasets ${datasetName}`);

      const dataset = await Dataset.open(`${this.sourceName}/${datasetName}`);

      await dataset.exportToJSON("OUTPUT", {
        toKVS: `${this.sourceName}/${datasetName}`,
      });
    }
  }

  async dropDatasets() {
    for (const datasetName of ["manuals", "products", "products_manuals"]) {
      const dataset = await Dataset.open(`${this.sourceName}/${datasetName}`);
      await dataset.drop();

      await Promise.all([
        state.serializer.dump({
          lastInnerIdProduct: 0,
        }),
        state.serializer.dump({
          lastInnerIdManual: 0,
        }),
      ]);
    }
  }
}
