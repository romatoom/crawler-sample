import { log } from "crawlee";
import fs from "fs";
import { mkdirp } from "mkdirp";
import path from "path";

export default function varSave(obj, filename, source) {
  const filePath = `saved_variables/${source.currentName}/${filename}.json`;
  mkdirp.sync(path.dirname(filePath));

  fs.writeFile(
    `saved_variables/${source.currentName}/${filename}.json`,
    JSON.stringify(obj),
    function (err) {
      if (err) {
        log.error(err);
      }
    }
  );
}
