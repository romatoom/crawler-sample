export default function pathOfEntity(sourceName, entityName) {
  return `storage/key_value_stores/${sourceName}/${entityName}/OUTPUT.json`;
}
