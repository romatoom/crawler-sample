import fs from "fs";

export default function varSave(obj, filename) {
  fs.writeFile(
    `saved_variables/${filename}.json`,
    JSON.stringify(obj),
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
}
