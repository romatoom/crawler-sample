let _existingProducts = [];
let _existingProductsNames;
let _existingProductsURLs;

export function getExistingProducts() {
  return _existingProducts;
}

export function getExistingProductsNames() {
  _existingProductsNames =
    _existingProductsNames || _existingProducts.map((el) => el.name);
  return _existingProductsNames;
}

export function getExistingProductsURLs() {
  _existingProductsURLs =
    _existingProductsURLs || _existingProducts.map((el) => el.url);
  return _existingProductsURLs;
}

export function setExistingProducts(values) {
  _existingProducts = [...values];
}
