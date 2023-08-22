function* generateProductURLs(productURLs, blockSize = 1) {
  const total = productURLs.length;
  console.log("total:", total);

  if (total === 0) {
    console.log("Product URLs list has no items");
    return;
  }

  let startIndex = 0;
  let stopIndex = blockSize;

  const products = productURLs.slice(startIndex, stopIndex);

  const printedStopIndex = stopIndex < total ? stopIndex : total;

  console.log(
    `Taken [${startIndex + 1} - ${printedStopIndex}] product(s) out of ${total}`
  );

  yield products;

  startIndex = blockSize;

  for (const [index, p] of productURLs.slice(startIndex).entries()) {
    console.log(`Taken ${startIndex + index + 1} product(s) out of ${total}`);
    yield [p];
  }
}

let productURLsGenerator;

export function setProductURLsGenerator(productURLs, count = 1) {
  productURLsGenerator = generateProductURLs(productURLs, count);
}

export function getProductURLs() {
  if (!productURLsGenerator) return null;
  const next = productURLsGenerator.next();
  if (next.done) return null;

  return next.value;
}
