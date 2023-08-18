import { log } from "crawlee";
import fs from "fs/promises";
import { mkdirp } from "mkdirp";
import path from "path";

export default async function varRead(filename, source, type = "object") {
  const filePath = `saved_variables/${source.currentName}/${filename}.json`;

  let data = await fs.readFile(filePath, { encoding: "utf8" });

  if (type === "arrayWithoutBrackets") {
    const lastCommaIndex = data.lastIndexOf(",");
    data = `[${data.slice(0, lastCommaIndex)}]`;
  }

  return JSON.parse(data);
}
