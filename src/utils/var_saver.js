import fs from "fs";

export default function varSave(obj, filename, sourceName) {
  fs.writeFile(
    `saved_variables/${sourceName}/${filename}.json`,
    JSON.stringify(obj),
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
}
