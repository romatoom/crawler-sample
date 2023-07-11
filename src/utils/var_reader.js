import { log } from "crawlee";
import fs from "fs/promises";
import { mkdirp } from "mkdirp";
import path from "path";

export default async function varRead(filename, source) {
  const filePath = `saved_variables/${source.currentName}/${filename}.json`;

  const data = await fs.readFile(filePath, { encoding: "utf8" });
  return JSON.parse(data);
}
