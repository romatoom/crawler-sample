export function* generateId(startId = 0) {
  let id = startId;
  while (id < 9999999999999) {
    yield id++;
  }
}

export const manualIdGenerator = generateId(1);
export const productIdGenerator = generateId(1);
