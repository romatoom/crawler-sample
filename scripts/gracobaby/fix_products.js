import { Database } from "#utils/classes/database.js";

// Устанавливаем нужное имя ресурса
const SOURCE_NAME = "gracobaby";

const database = await Database.build(SOURCE_NAME);

const products = await database.readProducts();

const sql = "UPDATE products SET category = ?, name = ? WHERE id = ?";

for (const product of products) {
  const category = product.category.replace("\n\n>", "");
  const name = product.name.replaceAll("™", "").replaceAll("®", "").trim();

  const values = [category, name, product.id];

  await database.db.run(sql, values, function (err) {
    if (err) return log.error(err.message);
  });
}
