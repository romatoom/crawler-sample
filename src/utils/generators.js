import { Dataset } from "crawlee";

export function* generateId(startId = 0) {
  let id = startId;
  while (id < 9999999999999) {
    yield id++;
  }
}

async function lastInnerId(source, entity) {
  const manualsDataset = await Dataset.open(`${source.currentName}/${entity}`);
  const manualsDatasetData = await manualsDataset.getData();
  return manualsDatasetData.items.length > 0
    ? Math.max(...manualsDatasetData.items.map((o) => o.innerId))
    : 0;
}

export async function setGenerators(source) {
  const lastManualInnerId = await lastInnerId(source, "manuals");
  const lastProductInnerId = await lastInnerId(source, "products");

  console.log(
    `Last manual inner id: ${lastManualInnerId}, last product inner id: ${lastProductInnerId}`
  );

  manualIdGenerator = generateId(lastManualInnerId + 1);
  productIdGenerator = generateId(lastProductInnerId + 1);
}

export let manualIdGenerator = generateId(1);
export let productIdGenerator = generateId(1);
