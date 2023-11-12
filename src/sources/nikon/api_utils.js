import axios from "axios";
import * as cheerio from "cheerio";
import { settings } from "#utils/globals.js";
import varSave from "#utils/var_saver.js";

import uniqWith from "lodash/uniqWith.js";
import isEqual from "lodash/isEqual.js";
import pkg from "core-js/actual/array/group-by.js";

import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";
import { Dataset } from "crawlee";

import { normalizeTitle } from "#utils/formatters.js";

const { groupBy } = pkg;

export async function getLangs() {
  const { BASE_URL } = settings.source;
  const url = `${BASE_URL}/select_language.html`;
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  const langs = [];

  $("ul.mod-list > li > span > a[href]").each((_, el) => {
    const link = $(el);
    const url = link.attr("href");

    // /en/index.html
    const locale = url.split("/")[1];

    const lang = link.text().trim();
    langs.push({ lang, locale });
  });

  return langs;
}

export async function getManualsURLs() {
  const manualsURLs = [];
  const langs = await getLangs();

  for (const langItem of langs) {
    console.log(`Getting urls for ${langItem.locale}`);

    const manualsForLocale = await getManualsURLsForLocale(langItem.locale);
    manualsURLs.push(...manualsForLocale);
  }

  varSave(manualsURLs, "manualsURLs", settings.source);
  return manualsURLs;
}

async function getManualsURLsForLocale(locale) {
  const { BASE_URL } = settings.source;

  const manualsURLs = [];

  for (const num of [1, 0]) {
    const url = `${BASE_URL}/${locale}/${num}/product_data.xml`;
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html, { xmlMode: true });

    $("category").each((_, category) => {
      if ($(category).attr("layer").trim() !== "main") return true;

      const categoryName = $(category).attr("name").trim();

      $(category)
        .find("product")
        .each((_, el) => {
          manualsURLs.push({
            name: $(el).attr("name"),
            url: `${BASE_URL}${$(el).attr("href")}`,
            category: categoryName,
          });
        });
    });
  }

  return uniqWith(manualsURLs, isEqual);
}

export function getPreparedManualsURLs(manualsURLs) {
  const groupedManualsURLs = manualsURLs.groupBy((manual) => manual.name);
  const filteredManualsURLs = {};

  for (const productName in groupedManualsURLs) {
    const enLocaleRow = groupedManualsURLs[productName].find((row) =>
      row.url.includes("https://downloadcenter.nikonimglib.com/en/")
    );

    const urls = groupedManualsURLs[productName].map((row) => row.url);

    if (!enLocaleRow) continue;

    filteredManualsURLs[productName] = {
      category: enLocaleRow.category,
      urls,
    };
  }

  return filteredManualsURLs;
}
