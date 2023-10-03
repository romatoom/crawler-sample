import axios from "axios";

import varSave from "#utils/var_saver.js";
import varRead from "#utils/var_reader.js";
import { settings } from "#utils/globals.js";

export async function getProducts() {
  const url =
    "https://km.support.apple.com/kb/index?page=products&locale=en_US";
  const response = await axios.get(url);

  const productsText = response.data
    .replaceAll("\n", "")
    .replaceAll("\t", "")
    .replaceAll("[ ]", "[]")
    .replaceAll("'", "\\'");

  const products = JSON.parse(productsText).products;
  varSave(products, "rawProducts", settings.source);

  return;
}

export async function getAllManuals() {
  const rawManuals = [];

  const locales = getLocales();
  const categories = await getCategories();

  const stepsCount = locales.length * categories.length;
  let step = 0;

  for (const locale of locales) {
    for (const category of categories) {
      step += 1;
      console.log(`${step} step of ${stepsCount}`);

      let page = 0;

      while (true) {
        try {
          const manualsData = await getManuals(page, category.id, locale);

          if (!Array.isArray(manualsData.manuals)) continue;

          const manuals = manualsData.manuals.map((m) => {
            m.locale = locale;
            m.category = category.name;
            return m;
          });

          if (manuals.length > 0) {
            rawManuals.push(...manuals);
          }

          page += 1;
        } catch (e) {
          console.error(
            `Error for https://km.support.apple.com/kb/index?page=manuals_browse&offset=${page}&sort=recency&facet=all&category=${category.id}&locale=${locale}`
          );
          break;
        }
      }
    }
  }

  varSave(rawManuals, "rawManuals", settings.source);
}

async function getManuals(offset, category, locale) {
  const url = `https://km.support.apple.com/kb/index?page=manuals_browse&offset=${offset}&sort=recency&facet=all&category=${category}&locale=${locale}`;
  const response = await axios.get(url);

  let manualsData;

  if (response.data !== null && typeof response.data === "object") {
    return response.data;
  }

  const manualsText = response.data
    .replaceAll("\n", "")
    .replaceAll("\t", "")
    .replaceAll("[ ]", "[]")
    .replaceAll("'", "\\'");

  return JSON.parse(manualsText);
}

function getLocales() {
  return [
    "ar_AE",
    "bg_BG",
    "cs_CZ",
    "da_DK",
    "de_DE",
    "el_GR",
    "en_US",
    "es_ES",
    "et_EE",
    "fi_FI",
    "fr_FR",
    "hr_HR",
    "hu_HU",
    "id_ID",
    "it_IT",
    "ja_JP",
    "ko_KR",
    "lt_LT",
    "lv_LV",
    "my_MM",
    "nl_NL",
    "no_NO",
    "pl_PL",
    "pt_PT",
    "ro_RO",
    "ru_RU",
    "sk_SK",
    "sl_SI",
    "sv_SE",
    "th_TH",
    "tr_TR",
    "uk_UA",
    "vi_VN",
    "zh_CN",
  ];
}

async function getCategories() {
  const products = await varRead("rawProducts", settings.source);
  const categories = [];

  for (const product of products) {
    categories.push({ id: product.id, name: product.name });
  }

  return categories;
}
