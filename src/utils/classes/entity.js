import state from "#utils/classes/state.js";

export class Entity {
  #datasetName;

  static lastInnerId = 0;

  static nextInnerId() {
    return ++this.lastInnerId;
  }

  constructor(data, datasetName) {
    this.#datasetName = datasetName;

    if (
      this.constructor.requiredAttributes.includes("innerId") &&
      !data.innerId
    ) {
      data.innerId = this.constructor.nextInnerId();
    }

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

  static async saveLastInnerId(entity) {
    if (!["Product", "Manual"].includes(entity.constructor.name)) return;

    const varName = `lastInnerId${entity.constructor.name}`;

    await state.serializer.dump({
      [varName]: entity.constructor.lastInnerId,
    });
  }
}
