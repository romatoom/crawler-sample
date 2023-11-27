import { openDatabase, readManuals } from "#utils/database.js";
import { getSourceByName, setSettings } from "#utils/globals.js";
import { replacerData } from "./replacerData.js";
import { langsContent } from "./langsContent.js";

// Устанавливаем нужное имя ресурса

const SOURCE_NAME = "lg";

const source = await getSourceByName(SOURCE_NAME);
setSettings({ source });

const manuals = await readManuals(source);
const db = await openDatabase(source);

const sql =
  "UPDATE manuals SET material_type = ?, languages = json(?) WHERE id = ?";



const materialTypesNotTranslated = [];

for (const manual of manuals) {
  const materialType =
    replacerData[manual.material_type] || manual.material_type;

  if (!Object.values(source.MATERIAL_TYPES).includes(materialType)) {
    materialTypesNotTranslated.push(materialType);
  }

  const languages = JSON.parse(manual.languages);

  for (const partOfTitle in langsContent) {
    if (manual.title.includes(partOfTitle)) {
      const lang = langsContent[partOfTitle];

      if (!languages.includes(lang)) {
        languages.push(lang);
      }
    }
  }

  const values = [materialType, JSON.stringify(languages), manual.id];

  await db.run(sql, values, function (err) {
    if (err) return log.error(err.message);
  });
}

console.log(...[new Set(materialTypesNotTranslated)]);
