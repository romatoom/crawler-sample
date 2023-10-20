import { readManuals } from "#utils/database.js";
import { getSourceByName, setSettings } from "#utils/globals.js";
import { openDatabase } from "#utils/database.js";

// Устанавливаем нужное имя ресурса
const SOURCE_NAME = "gigabyte";

const source = await getSourceByName(SOURCE_NAME);
setSettings({ source });

const manuals = await readManuals(source);

const db = await openDatabase(source);

const sql = "UPDATE manuals SET languages = ?, material_type = ? WHERE id = ?";

const MANUALS_TYPES = ["User Guide", "User Manual", "Installation Guide"];

for (const manual of manuals) {
  let languages = JSON.parse(manual.languages);
  languages = JSON.stringify(
    languages.filter((language) => language !== "Default")
  );

  let materialType = "Manual";
  for (const manualType of MANUALS_TYPES) {
    if (manual.title.includes(manualType)) {
      materialType = manualType;
      break;
    }
  }

  const values = [languages, materialType, manual.id];

  await db.run(sql, values, function (err) {
    if (err) return log.error(err.message);
  });
}
