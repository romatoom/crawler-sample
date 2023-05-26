import { Dataset } from "crawlee";

export async function dropDatasets(sourceName) {
  const manuals = await Dataset.open(`${sourceName}/manuals`);
  await manuals.drop();

  const products = await Dataset.open(`${sourceName}/products`);
  await products.drop();
}

export async function exportDatasets(sourceName) {
  const manuals = await Dataset.open(`${sourceName}/manuals`);
  await manuals.exportToJSON("OUTPUT", { toKVS: `${sourceName}/manuals` });

  const products = await Dataset.open(`${sourceName}/products`);
  await products.exportToJSON("OUTPUT", { toKVS: `${sourceName}/products` });
}
