import { settings } from "#utils/globals.js";
import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";
import { Dataset } from "crawlee";

export default function addHandlerProduct(router) {
  const { LABELS, BRAND, STORE_URL, currentName } = settings.source;

  router.addHandler(LABELS.STORY_PRODUCT, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    let manualLink = $(".card_docs_block ul > li > a").eq(0).attr("href");
    if (!manualLink || !manualLink.includes(".pdf")) return;
    manualLink = `${STORE_URL}${manualLink}`;
    const { productName, category } = request.userData.data;

    const specs = [];

    $(".card_description_block-hide .ttx_table_item").each((_, el) => {
      const label = $(el).find(".table_item-left").text().trim();
      const values = $(el).find(".table_item-right").text().trim();

      if (label?.length > 0 && values?.length > 0) {
        specs.push({ group: "Общие характеристики", label, values });
      }
    });

    const images = [];
    $(".card_main_photo_img img").each((_, el) => {
      images.push(`${STORE_URL}${$(el).attr("src")}`);
    });

    const description = $("h2.card_description_block-title")
      .filter(function () {
        return $(this).text().trim().includes("Описание модели");
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
      name: productName || $("h1").text().trim(),
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
      language: ["Русский"],
      metadata: {},
    });

    await productsManualsDataset.pushData({
      productId: currentProductId,
      manualId: currentManualId,
    });
  });
}
