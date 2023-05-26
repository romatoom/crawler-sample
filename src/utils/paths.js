export function pathOfEntity(sourceName, entityName) {
  return `storage/key_value_stores/${sourceName}/${entityName}/OUTPUT.json`;
}

export function pathOfPreparedEntity(sourceName, entityName) {
  return `prepared_data/${sourceName}/${entityName}.json`;
}
