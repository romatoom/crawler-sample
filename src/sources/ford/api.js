import { ApiService } from "#utils/classes/apiService.js";

export class FordAPI extends ApiService {
  static async getDocumentsByModelAndYear(year, model) {
    const url = `https://www.digitalservices.ford.com/pts/api/v2/owner-information-model-year?country=USA&language=EN-US&model=${model}&year=${year}`;

    console.log(url);

    const responseData = await this.get(url, {
      headers: {
        Origin: "https://www.ford.com",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (
      responseData.getOwnerInformationByYearModelResult.ownerServiceResult
        .length === 0
    )
      return [];

    return responseData.getOwnerInformationByYearModelResult.ownerServiceResult[0].matches.item
      .filter((el)=> el.link.toLowerCase().endsWith(".pdf"))
      .map(
        (el) => ({
          title: el.title,
          url: el.link,
          category: el.category,
        })
    );
  }
}
