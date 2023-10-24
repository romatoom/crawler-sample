import { settings } from "#utils/globals.js";
import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";
import { Dataset } from "crawlee";

export default function addHandlerManual(router) {
  const { LABELS, BASE_URL, currentName } = settings.source;

  router.addHandler(LABELS.MANUAL, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const { brand, productName, language } = request.userData.data;

    let manualLink = $("a.btn.btn-primary").eq(0).attr("href");
    if (!manualLink) return;
    manualLink = `${BASE_URL}${manualLink}`;

    console.log(manualLink);
    /*
    const manualLink = `${BASE_URL}${$(".full-params-item-val-pdf").attr(
      "href"
    )}`;
    if (!manualLink || !manualLink.includes(".pdf")) return;

    const { productName, category } = request.userData.data;

    const size = $(".full-params-item-val span").text().trim();

    const specs = [];
    $(".full-params-category-block")
      .eq(0)
      .find(".full-params-item")
      .each((_, spec) => {
        specs.push({
          group: "Общие характеристики",
          label: $(spec).find(".full-params-item-name").text().trim(),
          values: $(spec).find(".full-params-item-val").text().trim(),
        });
      });

    const images = [];
    $(".swiper-slide.card-photo-slider-item img").each((_, el) => {
      images.push(`${BASE_URL}${$(el).attr("src")}`);
    });

    const description = $("h2.card-section-title")
      .filter(function () {
        return $(this).text().trim() === "Описание";
      })
      .next()
      .text()
      .replaceAll("\r\n", "")
      .trim();

    const manualsDataset = await Dataset.open(`${currentName}/manuals`);
    const productsDataset = await Dataset.open(`${currentName}/products`);
    const productsManualsDataset = await Dataset.open(
      `${currentName}/products_manuals`
    );

    const currentProductId = productIdGenerator.next().value;

    await productsDataset.pushData({
      innerId: currentProductId,
      brand: BRAND,
      category,
      name: productName || $(".card-title").text().trim(),
      url: request.url,
      specs,
      images,
      description,
    });

    const currentManualId = manualIdGenerator.next().value;

    await manualsDataset.pushData({
      innerId: currentManualId,
      materialType: "Manual",
      pdfUrl: manualLink,
      title: `Manual for ${productName}`,
      language: ["Русский", "Қазақ"],
      metadata: size?.length > 0 ? { size } : {},
    });

    await productsManualsDataset.pushData({
      productId: currentProductId,
      manualId: currentManualId,
    });
    */
  });
}
