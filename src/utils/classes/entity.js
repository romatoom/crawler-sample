export class Entity {
  #datasetName;

  constructor(data, datasetName) {
    this.#datasetName = datasetName;
    this.data = data;

    const validate = this.validate();

    if (validate.result === false) {
      throw new Error(`${this.constructor.name} invalid: ${validate.message}`);
    }
  }

  get datasetName() {
    return this.#datasetName;
  }

  requiredAttributesExists() {
    return this.constructor.requiredAttributes.every((attr) =>
      this.data.hasOwnProperty(attr)
    );
  }
}
