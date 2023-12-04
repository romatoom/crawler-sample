export class Paths {
  constructor(sourceName) {
    this.sourceName = sourceName;
  }

  pathOfEntity(entityName) {
    return `storage/key_value_stores/${this.sourceName}/${entityName}/OUTPUT.json`;
  }

  pathOfEntityDataset(entityName) {
    return `storage/datasets/${this.sourceName}/${entityName}`;
  }
}
