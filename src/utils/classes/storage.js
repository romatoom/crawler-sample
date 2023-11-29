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

  async dropDatasets() {
    for (const datasetName of ["manuals", "products", "products_manuals"]) {
      const dataset = await Dataset.open(`${this.sourceName}/${datasetName}`);
      await dataset.drop();
    }
  }
}
