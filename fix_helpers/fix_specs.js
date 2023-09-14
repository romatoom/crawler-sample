import { readProducts } from "#utils/database.js";
import { SOURCES } from "#utils/globals.js";
import { openDatabase } from "#utils/database.js";

const products = await readProducts(SOURCES.CASIO);
const db = await openDatabase(SOURCES.CASIO);

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
