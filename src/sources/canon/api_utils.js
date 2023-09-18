import axios from "axios";
import * as cheerio from "cheerio";
import varSave from "#utils/var_saver.js";
import { settings } from "#utils/globals.js";

function getColumnNameByIndex(index) {
  switch (index % 4) {
    case 0:
      return "name";
    case 1:
      return "date";
    case 2:
      return "size";
    case 3:
      return "url";
  }
}

export async function getResourcesBySKU(sku) {
  const url = `https://www.usa.canon.com/bin/canon/getexperiencefragment.${sku}.resources.html`;

  const response = await axios.get(url);

  if (response.data["Error Code"] === 400) return {};

  const html = response.data;
  const $ = cheerio.load(html);

  const resources = {};

  $(".downloadable-table").each((_, table) => {
    const type = $(table).prev().find("h2").text().trim();

    const resourcesData = [];
    let rowIndex = -1;
    $(table)
      .find(".canon-table .canon-table-cell")
      .each((index, cell) => {
        const el = $(cell);

        if (index % 4 === 0) {
          rowIndex++;
          resourcesData.push({});
        }

        const columnName = getColumnNameByIndex(index);
        if (!columnName) return false;

        let columnValue;
        switch (columnName) {
          case "name":
            columnValue = el
              .find(".canon-table-content-area .downloadable-asset-title")
              .text()
              .trim();
            break;
          case "date":
          case "size":
            columnValue = el.find(".canon-table-content-area p").text().trim();
            break;
          case "url":
            columnValue = `https://www.usa.canon.com${el
              .find(".canon-table-content-area a.btn")
              .attr("data-path")
              .trim()}`;
        }

        if (!columnValue || columnValue.length === 0) return false;

        resourcesData[rowIndex][columnName] = columnValue;
      });

    if (resourcesData.length > 0) {
      resources[type] = resourcesData;
    }
  });

  return resources;
}

async function getPdfURL(url) {
  try {
    const response = await axios.get(url);
    const responseUrl = response.request?.res?.responseUrl;
    return responseUrl && responseUrl.endsWith(".pdf")
      ? responseUrl
      : undefined;
  } catch (err) {
    return;
  }
}

export function getTypeManual(documentKey) {
  switch (documentKey) {
    case "White Papers":
      return "White Paper";
    case "Brochures":
      return "Brochure";
    default:
      return "Manual";
  }
}

export async function getManualsFromSupportPage(url) {
  try {
    const response = await axios.get(url);

    const body = response.data;
    const $ = cheerio.load(body);

    const manualsData = [];

    const rows = $(".manuals-download-table .download.manual-download-list");
    for (const row of rows) {
      try {
        const elem = $(row);

        const link = elem.find(".download__title a.button-manuals");

        const linkUrl = link.attr("data-file");

        const url = await getPdfURL(linkUrl);
        if (!url) continue;

        const name = link.text().trim();

        const date = elem
          .find(".download__date .download__value")
          .text()
          .trim();

        const size = elem
          .find(".download__size")
          .first()
          .contents()
          .filter(function () {
            return this.type === "text";
          })
          .text()
          .trim();

        manualsData.push({
          name,
          date,
          size,
          url,
        });
      } catch (err) {
        console.error(err);
      }
    }

    return manualsData.length > 0 ? { Manuals: manualsData } : {};
  } catch (e) {
    return {};
  }
}

export async function getManuals(productURL) {
  const productLabel = productURL.replace(
    "https://www.usa.canon.com/shop/p/",
    ""
  );
  const url = `https://www.usa.canon.com/support/p/${productLabel}`;

  const manuals = await getManualsFromSupportPage(url);
  return manuals;
}

export async function getProductsManuals() {
  const url = `https://www.canon-europe.com/support/system/supportsearchproductsitemap.json`;

  const response = await axios.get(url);

  const productManuals = response.data.support_consumer_products.map((pm) => {
    pm.url = `https://www.canon-europe.com${pm.url}`;
    return pm;
  });

  varSave(productManuals, "productManuals", settings.source);

  return productManuals;
}

export async function getManualsOnPageForLang(lang, id) {
  async function parseBlock(manualBlock) {
    const dataURL = manualBlock
      .find(".bs-btn.bs-btn-primary")
      .attr("data-download-url");

    const url = await getPdfURL(dataURL);
    if (!url) return;

    const title = manualBlock
      .find(".align-items-start > .bs-col-12 > .support-page__details-link")
      .text()
      .trim();

    const releaseDate = manualBlock
      .find(".d-flex.flex-column.flex-md-row .fs-sm")
      .last()
      .text()
      .replace("Release date:", "")
      .trim();

    let language = [lang.value];
    manualBlock
      .find(
        ".support-page__results-mobile-accordion-container .accordion__collapsable .bs-col-md-3"
      )
      .each((_, el) => {
        const lang = $(el).text().trim();
        if (lang) language.push(lang);
      });
    language = [...new Set(language)];

    return {
      title,
      releaseDate,
      url,
      language,
    };
  }

  const url = `https://www.canon-europe.com/supportproduct/tabcontent/?type=manuals&language=${lang.key}&productTcmUri=${id}`;

  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  const promises = [];

  $(".border-bottom.border-1.border-gray.pb-3.mb-3.mb-md-8").each((_, el) => {
    promises.push(parseBlock($(el)));
  });

  const manuals = await Promise.all(promises);

  return manuals.filter((m) => m);
}
