function* generateProductURL(productsURLs) {
  const total = productsURLs.length;
  for (const [index, p] of productsURLs.entries()) {
    console.log(`Taken ${index + 1} product(s) out of ${total}`);
    yield p;
  }
}

let productUrlGenerator;

export function setProductUrlGenerator(productsURLs) {
  productUrlGenerator = generateProductURL(productsURLs);
}

export function getProductUrl() {
  if (!productUrlGenerator) return null;
  const next = productUrlGenerator.next();
  if (next.done) return null;

  return next.value;
}
