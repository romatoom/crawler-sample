import { ApiService } from "#utils/classes/apiService.js";
import * as cheerio from "cheerio";

export class VauxhallAPI extends ApiService {
  static async getProducts(mainUrl) {
    const products = [];

    const url = `${mainUrl}/apps/atomic/getVehicleTeasers.json?path=L2NvbnRlbnQvdmF1eGhhbGwvd29ybGR3aWRlL3VrL2VuL2luZGV4L2Jhc2ViYWxsLWNhcmRzL2JiYy1jb2xsZWN0aW9ucy9yYW5nZS1hbGw=PuGlIfE&feefoEnabled=false&expandOnThumbnailClick=false&expandingMenuEnabled=false`;

    const data = await this.get(url);

    for (let item of data.bbcTeaser) {
      const html = item
        .replaceAll("&#34;", "'")
        .replaceAll("\\n", "\n")
        .replaceAll("\t", " ");

      const $ = cheerio.load(html);

      $("a.stat-image-link.q-vehicle-teaser-link").each((_, link) => {
        const name = $(link)
          .find(".q-carline")
          .text()
          .toUpperCase()
          .replace("ELECTRIC", "")
          .trim();

        products.push({
          url: $(link).attr("href"),
          name,
          image: $(link).find(".q-image-container > img").attr("src"),
        });
      });
    }

    return products;
  }
}
