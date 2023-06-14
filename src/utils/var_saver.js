import fs from "fs";

export default function varSave(obj, filename, sourceName) {
  fs.writeFile(
    `saved_variables/${sourceName}/${filename}.txt`,
    JSON.stringify(obj),
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
}
