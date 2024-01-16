import { Database } from "#utils/classes/database.js";

// Устанавливаем нужное имя ресурса
const SOURCE_NAME = "gracobaby";

const database = await Database.build(SOURCE_NAME);

const manuals = await database.readManuals();

const sql = "UPDATE manuals SET material_type = ? WHERE id = ?";

const types = {
  "Instruction Manual": "Instruction Manual",
  "Quick Start Guide": "Quick Start Guide",
  FAQs: "FAQs",
  "PRODUCT INSTRUCTIONS": "Products Instructions",
};

for (const manual of manuals) {
  let materalType = "Manual";

  for (const type in types) {
    if (manual.title.includes(type)) {
      materalType = types[type];
      break;
    }
  }

  const values = [materalType, manual.id];

  await database.db.run(sql, values, function (err) {
    if (err) return log.error(err.message);
  });
}
