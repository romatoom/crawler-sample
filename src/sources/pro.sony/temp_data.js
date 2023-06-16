export let _langs = [];
export let _langCountryCodes = [];

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
