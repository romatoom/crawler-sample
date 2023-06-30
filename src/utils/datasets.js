import { Dataset, log } from "crawlee";
import { settings } from "#utils/globals.js";

export async function dropDatasets(source = settings.source) {
  const manuals = await Dataset.open(`${source.currentName}/manuals`);
  await manuals.drop();

  const products = await Dataset.open(`${source.currentName}/products`);
  await products.drop();

  const productsManuals = await Dataset.open(
    `${source.currentName}/products_manuals`
  );
  await productsManuals.drop();
}

export async function exportDatasets(source = settings.source) {
  log.info("Export datasets.");

  const manuals = await Dataset.open(`${source.currentName}/manuals`);
  await manuals.exportToJSON("OUTPUT", {
    toKVS: `${source.currentName}/manuals`,
  });

  const products = await Dataset.open(`${source.currentName}/products`);
  await products.exportToJSON("OUTPUT", {
    toKVS: `${source.currentName}/products`,
  });

  const productsManuals = await Dataset.open(
    `${source.currentName}/products_manuals`
  );
  await productsManuals.exportToJSON("OUTPUT", {
    toKVS: `${source.currentName}/products_manuals`,
  });
}
