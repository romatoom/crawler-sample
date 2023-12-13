import { Database } from "#utils/classes/database.js";
import { URLGetter } from "#utils/classes/urlGetter/urlGetter.js";

// Устанавливаем нужное имя ресурса
const SOURCE_NAME = "cannondale";

const database = await Database.build(SOURCE_NAME);

const manuals = await database.readManuals();

const sql = "UPDATE manuals SET pdf_url = ? WHERE id = ?";

const urls = manuals.map((m) => m.pdf_url);
const urlGetter = await URLGetter.build(urls);
const urlsHashes = await urlGetter.getURLsHashes();

for (const manual of manuals) {
  let pdfUrl = urlsHashes[manual.pdf_url] || manual.pdf_url;

  const values = [pdfUrl, manual.id];

  await database.db.run(sql, values, function (err) {
    if (err) return log.error(err.message);
  });
}
