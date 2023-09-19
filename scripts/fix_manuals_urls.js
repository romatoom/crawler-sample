import { readManuals } from "#utils/database.js";
import { getSourceByName, setSettings } from "#utils/globals.js";
import { openDatabase } from "#utils/database.js";

// Устанавливаем нужное имя ресурса
const SOURCE_NAME = "einhell_service";

const source = await getSourceByName(SOURCE_NAME);
setSettings({ source });

const manuals = await readManuals(source);
console.log(manuals.length);

const db = await openDatabase(source);

const sql = "UPDATE manuals SET pdf_url = ? WHERE id = ?";

for (const manual of manuals) {
  let pdfUrl = manual.pdf_url;
  pdfUrl = pdfUrl.replaceAll(" ", "%20");

  const values = [pdfUrl, manual.id];

  await db.run(sql, values, function (err) {
    if (err) return log.error(err.message);
  });
}
