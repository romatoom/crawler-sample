import { readManuals } from "#utils/database.js";
import { getSourceByName, setSettings } from "#utils/globals.js";
import { openDatabase } from "#utils/database.js";

// Устанавливаем нужное имя ресурса
const SOURCE_NAME = "hyundaiusa";

const source = await getSourceByName(SOURCE_NAME);
setSettings({ source });

const manuals = await readManuals(source);
console.log(manuals.length);

const db = await openDatabase(source);

const sql = "UPDATE manuals SET material_type = ? WHERE id = ?";

for (const manual of manuals) {
  const manualTitle = manual.title;

  let materialType = "Manual";

  for (const manualType of source.MANUAL_TYPES) {
    if (manualTitle.includes(manualType)) {
      materialType = manualType;
      break;
    }
  }

  const values = [materialType, manual.id];

  await db.run(sql, values, function (err) {
    if (err) return log.error(err.message);
  });
}
