import { Dataset } from "crawlee";

export class Storage {
  constructor(sourceName) {
    this.sourceName = sourceName;
  }

  async pushData(entity) {
    if (!this.sourceName) {
      return new Error("Need set source name");
    }

    const dataset = await Dataset.open(
      `${this.sourceName}/${entity.datasetName}`
    );

    await dataset.pushData(entity.data);
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
    }
  }
}
