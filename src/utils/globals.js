let currentManualId = 1;
let currentProductId = 1;
let id = 0;

export const settings = {
  onlyNewProducts: false
}

export function getCurrentManualId() {
  return currentManualId;
}

export function incrementCurrentManualId() {
  currentManualId++;
}

export function getCurrentProductId() {
  return currentProductId;
}

export function incrementCurrentProductId() {
  currentProductId++;
}

export const SOURCE_WITHOUT_PRODUCTS_MANUALS_DATASET = [
  'mi'
];

export function generateId() {
  return id++;
}


