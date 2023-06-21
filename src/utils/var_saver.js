import fs from "fs";
import { log } from "crawlee";

export default function varSave(obj, filename, sourceName) {
  fs.writeFile(
    `saved_variables/${sourceName}/${filename}.json`,
    JSON.stringify(obj),
    function (err) {
      if (err) {
        log.error(err);
      }
    }
  );
}
