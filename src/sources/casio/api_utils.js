import axios from "axios";
import * as cheerio from "cheerio";
import varSave from "#utils/var_saver.js";
import { SOURCES } from "#utils/globals.js";
import LocaleCode from "locale-code";
import CASIO from "./constants.js";
import { getMainURL } from "#utils/paths.js";

const URLS = {
  watches:
    "https://www.casio.com/content/casio/locales/intl/en/products/watches/jcr:content/root/responsivegrid/container/product_panel_list_f.products.json",
  "electronic-musical-instruments":
    "https://www.casio.com/content/casio/locales/intl/en/products/electronic-musical-instruments/jcr:content/root/responsivegrid/container_copy/product_panel_list_f.products.json",
  "scientific-calculators":
    "https://www.casio.com/content/casio/locales/intl/en/products/scientific-calculators/jcr:content/root/responsivegrid/container_copy/product_panel_list_f.products.json",
  "basic-calculators":
    "https://www.casio.com/content/casio/locales/intl/en/products/basic-calculators/jcr:content/root/responsivegrid/container_copy_copy/product_panel_list_f.products.json",
  "label-writer":
    "https://www.casio.com/content/casio/locales/intl/en/products/label-writer/jcr:content/root/responsivegrid/container/product_panel_list_f.products.json",
};

export async function getProducts() {
  const products = [];

  for (const [category, url] of Object.entries(URLS)) {
    const response = await axios.get(url);

    const data = response.data?.data;
    if (!data) continue;

    const categoryProducts = data.map((el) => ({
      category,
      url: el.url,
      sku: el.sku,
      dataProductName: el.dataProductName,
      image: el.productAssets?.path
        ? `https://www.casio.com${el.productAssets.path}`
        : null,
    }));

    products.push(...categoryProducts);
  }

  varSave(products, "products", SOURCES.CASIO);

  return products;
}

// https://support.casio.com/en/manual/manualsearch.php?cid=009&MODULE=2744
// https://support.casio.com/fr/manual/manualfile.php?cid=003002003
export async function getManuals(url) {
  const manuals = [];

  for (const [locale, language] of Object.entries(CASIO.LANGS)) {
    try {
      const prefixLength = "https://support.casio.com/".length;
      const currentLocale = url.slice(prefixLength, prefixLength + 2);
      const langUrl = url.replace(
        `https://support.casio.com/${currentLocale}`,
        `https://support.casio.com/${locale}`
      );

      const response = await axios.get(langUrl);
      const html = response.data;
      const $ = cheerio.load(html);

      $(".latest-information a").each((_, el) => {
        const link = $(el);
        const linkURL = link.attr("href");

        if (!linkURL.endsWith(".pdf")) return true;

        let url;
        if (linkURL.startsWith("https://")) {
          url = linkURL;
        } else if (linkURL.startsWith("./")) {
          url = `${getMainURL(langUrl)}${linkURL.replace("./", "/")}`;
        } else {
          url = `https://support.casio.com${linkURL}`;
        }

        manuals.push({ url, language });
      });
    } catch (err) {
      continue;
    }
  }

  return manuals;
}
