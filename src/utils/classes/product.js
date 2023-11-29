import { Entity } from "./entity.js";
import isUrl from "is-valid-http-url";

export class Product extends Entity {
  static requiredAttributes = ["innerId", "brand", "category", "name"];

  constructor(data) {
    const datasetName = "products";
    super(data, datasetName);
  }

  validate() {
    if (!this.requiredAttributesExists()) {
      return {
        result: false,
        message: "Not all required attributes are specified",
      };
    }

    if (
      this.data.hasOwnProperty("url") &&
      this.data.url !== null &&
      !isUrl(this.data.url)
    ) {
      return { result: false, message: "Invalid URL" };
    }

    if (
      this.data.hasOwnProperty("specs") &&
      !this.data.specs.every((spec) => spec.label && spec.values)
    ) {
      return { result: false, message: "Invalid specs" };
    }

    if (
      this.data.hasOwnProperty("images") &&
      !this.data.images.every((imageURL) => isUrl(imageURL))
    ) {
      return { result: false, message: "Invalid images" };
    }

    return { result: true, message: "Valid" };
  }
}
