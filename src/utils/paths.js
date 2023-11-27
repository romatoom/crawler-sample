import { settings } from "#utils/globals.js";

export function pathOfEntity(entityName, source = settings.source) {
  return `storage/key_value_stores/${source.currentName}/${entityName}/OUTPUT.json`;
}

export function pathOfEntityDataset(entityName, source = settings.source) {
  return `storage/datasets/${source.currentName}/${entityName}`;
}

export function getMainURL(url) {
  return url.split("/").slice(0, -1).join("/");
}
