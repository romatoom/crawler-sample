import { Dataset } from "crawlee";
import { settings } from "#utils/globals.js";
import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";
import { getManuals } from "../api_utils.js";
import { CASIO_FORMATTERS } from "#utils/formatters.js";

export default function addHandlerSupportManuals(router) {
  const { LABELS, BRAND, currentName } = settings.source;

  // https://support.casio.com/en/manual/manualsearch.php?cid=009&MODULE=2744
  // https://support.casio.com/fr/manual/manualfile.php?cid=003002003
  router.addHandler(LABELS.SUPPORT_MANUALS, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const { category, productTitle } = request.userData.data;

    const manuals = await getManuals(request.url);
    /*
    const manuals = [];

    $(".column.column-sub.bg-white > section").each((_, el) => {
      const manualTitle = $(el).find("h2").text().trim();
      const link = $(el).find(".column.bg-white.latest-information li a");

      const pdfURL = `${mainUrl}${link.attr("href").replace("./", "/")}`;

      manuals.push({ pdfURL, manualTitle });
    });
    */

    if (manuals.length === 0) return;

    const manualsDataset = await Dataset.open(`${currentName}/manuals`);
    const productsDataset = await Dataset.open(`${currentName}/products`);
    const productsManualsDataset = await Dataset.open(
      `${currentName}/products_manuals`
    );

    for (const productName of CASIO_FORMATTERS.getSeparateNames(productTitle)) {
      const currentProductId = productIdGenerator.next().value;

      await productsDataset.pushData({
        innerId: currentProductId,
        brand: BRAND,
        category,
        name: productName,
        url: null,
        specs: [],
        images: [],
        metadata: {},
      });

      for (const manual of manuals) {
        const currentManualId = manualIdGenerator.next().value;

        let materialType = "Manual";

        materialType = manual.url.includes("quickstartguide")
          ? "Quick Start Guide"
          : materialType;

        materialType = manual.url.includes("usersguide")
          ? "Users Guide"
          : materialType;

        materialType = manual.url.includes("readthis")
          ? "Read This"
          : materialType;

        materialType = manual.url.includes("midiimplementation")
          ? "MIDI Implementation"
          : materialType;

        await manualsDataset.pushData({
          innerId: currentManualId,
          materialType,
          pdfUrl: encodeURI(manual.url),
          title: `${materialType} for ${productName}`,
          language: manual.language,
          metadata: {},
        });

        await productsManualsDataset.pushData({
          productId: currentProductId,
          manualId: currentManualId,
        });
      }
    }
  });
}
