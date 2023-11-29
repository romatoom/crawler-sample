import { Entity } from "./entity.js";

export class ProductManual extends Entity {
  static requiredAttributes = ["productId", "manualId"];

  constructor(data) {
    const datasetName = "products_manuals";
    super(data, datasetName);
  }

  validate() {
    if (!this.requiredAttributesExists()) {
      return {
        result: false,
        message: "Not all required attributes are specified",
      };
    }

    return { result: true, message: "Valid" };
  }
}
