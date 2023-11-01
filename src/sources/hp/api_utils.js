import axios from "axios";
import { settings } from "#utils/globals.js";

export async function getCategories() {
  const BASE_URL = settings.source.BASE_URL;
  const url = `${BASE_URL}/wcc-services/prodcategory/us-en/active-products`;
  const response = await axios.get(url);

  return response.data.data.fieldList.map((d) => ({
    category: d.alternateName || d.name,
    url: `${BASE_URL}${d.redirectUrl}`,
  }));
}

export async function getLangsForProduct(productID) {
  const url = `https://support.hp.com/wcc-services/pdp/manuals/getManualDropdownList?productID=${productID}&cc=us&lc=en`;
  const response = await axios.get(url);
  return response.data.data;
}

export async function getLangManualsForProduct(productID, language) {
  try {
    const url = `https://support.hp.com/wcc-services/pdp/manuals/getManuals?productID=${productID}&languageCode=${language.languageCode}`;
    const response = await axios.get(url);

    if (!response?.data?.data) {
      return [];
    }

    return response.data.data.manuals
      .map((m) => ({
        url: m.url,
        title: m.value,
        size: m.fileBytes,
        type: m.contentType,
        language: language.languageName,
      }))
      .filter((m) => m.url.includes(".pdf"));
  } catch (err) {
    return [];
  }
}
