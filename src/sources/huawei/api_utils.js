import axios from "axios";
import * as cheerio from "cheerio";
import uniqWith from "lodash/uniqWith.js";
import isEqual from "lodash/isEqual.js";

export async function getLangs() {
  const url = "https://consumer.huawei.com/en/worldwide/";
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  const langs = [];

  $("li.country-selection__country > a").each((_, el) => {
    langs.push({
      langCode: $(el).attr("data-selectsitecode"),
      language: $(el).text().trim().split("/")[1].trim(),
    });
  });

  return uniqWith(langs, isEqual);
}
