import { readManuals } from "#utils/database.js";
import { getSourceByName, setSettings } from "#utils/globals.js";
import { openDatabase } from "#utils/database.js";
import { getLanguageByLangCode } from "#utils/formatters.js";

// Устанавливаем нужное имя ресурса
const SOURCE_NAME = "minelab";

const source = await getSourceByName(SOURCE_NAME);
setSettings({ source });

const manuals = await readManuals(source);
console.log(manuals.length);

const db = await openDatabase(source);

const sql = "UPDATE manuals SET languages = ? WHERE id = ?";

for (const manual of manuals) {
  const languages = JSON.parse(manual.languages).map((lang) =>
    getLanguageByLangCode(lang)
  );

  const values = [JSON.stringify(languages), manual.id];

  await db.run(sql, values, function (err) {
    if (err) return log.error(err.message);
  });
}
