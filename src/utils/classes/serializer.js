import fs from "fs/promises";
import { mkdirp } from "mkdirp";
import path from "path";

export class Serializer {
  constructor(sourceName) {
    this.sourceName = sourceName;
  }

  getFilePath(filename) {
    return `saved_variables/${this.sourceName}/${filename}.json`;
  }

  async dump(obj, options = { append: false }) {
    const [objName] = Object.keys(obj);
    const [objValue] = Object.values(obj);
    const isArray = Array.isArray(objValue);
    const append = options?.append || false;

    if (isArray && append && obj.length === 0) return;

    console.log(isArray);

    const filePath = this.getFilePath(objName);
    mkdirp.sync(path.dirname(filePath));

    const outputString =
      isArray && append
        ? JSON.stringify(objValue).slice(1, -1) + ","
        : JSON.stringify(objValue);

    const saveFunc = append ? fs.appendFile : fs.writeFile;

    await saveFunc(filePath, outputString);
  }

  async load(objName, options = { append: false }) {
    const append = options?.append || false;

    const filePath = this.getFilePath(objName);

    let data = await fs.readFile(filePath, { encoding: "utf8" });

    if (append) {
      const lastCommaIndex = data.lastIndexOf(",");
      data = `[${data.slice(0, lastCommaIndex)}]`;
    }

    return JSON.parse(data);
  }
}
