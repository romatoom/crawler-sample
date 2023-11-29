export function pageCount(total, perPage = 18) {
  return Math.ceil(total / perPage);
}

export function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export function findIndexesOfSubstring(str, substr) {
  const indexes = [];

  let lastIndex = -1;

  while ((lastIndex = str.indexOf(substr, lastIndex + 1)) !== -1) {
    indexes.push(lastIndex);
  }

  return indexes;
}
