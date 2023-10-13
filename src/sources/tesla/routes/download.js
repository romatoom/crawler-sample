import { settings } from "#utils/globals.js";
import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";
import { Dataset } from "crawlee";

export default function addHandlerDownload(router) {
  const { LABELS, BRAND, currentName } = settings.source;

  router.addHandler(LABELS.DOWNLOAD, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const { productName, language } = request.userData.data;

    let imageSrc = $(".image.cover-image");
    if (imageSrc) {
      imageSrc = imageSrc.attr("src").replace("../../", "");
    }

    const image = imageSrc
      ? `https://www.tesla.com/ownersmanual/${imageSrc}`
      : null;

    const manualLink = request.url.endsWith("/")
      ? `${request.url}Owners_Manual.pdf`
      : `${request.url}/Owners_Manual.pdf`;

    const manualsDataset = await Dataset.open(`${currentName}/manuals`);
    const productsDataset = await Dataset.open(`${currentName}/products`);
    const productsManualsDataset = await Dataset.open(
      `${currentName}/products_manuals`
    );

    const currentProductId = productIdGenerator.next().value;

    await productsDataset.pushData({
      innerId: currentProductId,
      brand: BRAND,
      category: "Vehicles",
      name: productName,
      url: null,
      specs: [],
      images: image ? [image] : [],
    });

    const currentManualId = manualIdGenerator.next().value;

    await manualsDataset.pushData({
      innerId: currentManualId,
      materialType: "Owners Manual",
      pdfUrl: manualLink,
      title: `Owners Manual for ${productName}`,
      language,
      metadata: {},
    });

    await productsManualsDataset.pushData({
      productId: currentProductId,
      manualId: currentManualId,
    });
  });
}
