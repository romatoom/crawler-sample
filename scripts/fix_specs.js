import { readProducts } from "#utils/database.js";
import { getSourceByName } from "#utils/globals.js";
import { openDatabase } from "#utils/database.js";

// Устанавливаем нужное имя ресурса
const SOURCE_NAME = "casio";

const source = await getSourceByName(SOURCE_NAME);

const products = await readProducts(source);
const db = await openDatabase(source);

const sql = "UPDATE products SET specs = json(?) WHERE id = ?";

for (const product of products) {
  let specs = product.specs;
  if (specs === "[]") continue;

  specs = specs.replaceAll('","value":"', '","values":"');

  const values = [specs, product.id];

  await db.run(sql, values, function (err) {
    if (err) return log.error(err.message);
  });
}
