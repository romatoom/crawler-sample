import { Entity } from "./entity.js";
import isUrl from "is-valid-http-url";

export class Manual extends Entity {
  static requiredAttributes = ["innerId", "materialType", "pdfUrl"];

  static equals(manual1, manual2) {
    return manual1.data.pdfUrl === manual2.data.pdfUrl;
  }

  constructor(data) {
    const datasetName = "manuals";
    super(data, datasetName);
  }

  validate() {
    if (!this.requiredAttributesExists()) {
      return {
        result: false,
        message: "Not all required attributes are specified",
      };
    }

    if (!isUrl(this.data.pdfUrl)) {
      return { result: false, message: "Invalid manual URL" };
    }

    return { result: true, message: "Valid" };
  }
}
