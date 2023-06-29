import { Dataset, log } from "crawlee";
import { settings } from "#utils/globals.js";

export async function dropDatasets(source) {
  const manuals = await Dataset.open(`${source.name}/manuals`);
  await manuals.drop();

  const products = await Dataset.open(`${source.name}/products`);
  await products.drop();

  const productsManuals = await Dataset.open(`${source.name}/products_manuals`);
  await productsManuals.drop();
}

export async function exportDatasets(source) {
  log.info("Export datasets.");

  const manuals = await Dataset.open(`${source.name}/manuals`);
  await manuals.exportToJSON("OUTPUT", { toKVS: `${source.name}/manuals` });

  const products = await Dataset.open(`${source.name}/products`);
  await products.exportToJSON("OUTPUT", { toKVS: `${source.name}/products` });

  const productsManuals = await Dataset.open(`${source.name}/products_manuals`);
  await productsManuals.exportToJSON("OUTPUT", {
    toKVS: `${source.name}/products_manuals`,
  });
}
