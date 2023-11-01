import { log } from "crawlee";
import fs from "fs";
import { mkdirp } from "mkdirp";
import path from "path";

export default function varSave(
  obj,
  filename,
  source,
  mode = "write",
  type = "object"
) {
  if (type === "array" && mode === "append" && obj.length === 0) return;

  const filePath = `saved_variables/${source.currentName}/${filename}.json`;
  mkdirp.sync(path.dirname(filePath));

  const saveFunc = mode === "write" ? fs.writeFile : fs.appendFile;

  let outputString =
    type === "array" && mode === "append"
      ? JSON.stringify(obj).slice(1, -1) + ","
      : JSON.stringify(obj);

  saveFunc(
    `saved_variables/${source.currentName}/${filename}.json`,
    outputString,
    function (err) {
      if (err) {
        log.error(err);
      }
    }
  );
}
