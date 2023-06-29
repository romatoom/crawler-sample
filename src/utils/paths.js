export default function pathOfEntity(source, entityName) {
  return `storage/key_value_stores/${source.name}/${entityName}/OUTPUT.json`;
}
