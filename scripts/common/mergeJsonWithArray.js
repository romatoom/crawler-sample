import fs from "fs/promises";
import uniqWith from "lodash/uniqWith.js";
import isEqual from "lodash/isEqual.js";

const path = "saved_variables/gracobaby";

const fileNames = ["products.json", "products-.json", "products--.json"];

const products = [];

for (const fileName of fileNames) {
  let data = await fs.readFile(`${path}/${fileName}`, { encoding: "utf8" });

  const lastCommaIndex = data.lastIndexOf(",");

  data = `[${data.slice(0, lastCommaIndex)}]`;

  products.push(...JSON.parse(data));
}

const uniqProducts = uniqWith(products, isEqual);

console.log(products.length);
console.log(uniqProducts.length);
