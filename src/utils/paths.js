import { settings } from "#utils/globals.js";

export default function pathOfEntity(entityName, source = settings.source) {
  return `storage/key_value_stores/${source.currentName}/${entityName}/OUTPUT.json`;
}
