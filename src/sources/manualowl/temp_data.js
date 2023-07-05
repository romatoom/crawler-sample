let _langs = [];
let _langCountryCodes = [];

let _existingProducts = [];
let _existingProductsNames = [];

export function langs() {
  return _langs;
}

export function langCountryCodes() {
  return _langCountryCodes;
}

export function setLangs(value) {
  _langs = [...value];
}

export function setLangCountryCodes(value) {
  _langCountryCodes = [...value];
}

export function getExistingProducts() {
  return _existingProducts;
}

export function getExistingProductsNames() {
  return _existingProductsNames;
}

export function setExistingProducts(value) {
  _existingProducts = [...value];
  _existingProductsNames = _existingProducts.map((el) => el.name);
}
