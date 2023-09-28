import { Dataset } from "crawlee";
import { settings } from "#utils/globals.js";
import { productIdGenerator, manualIdGenerator } from "#utils/generators.js";
import { findIndexesOfSubstring } from "#utils/calc.js";
import { getLanguageByLangCode } from "#utils/formatters.js";

export default function addHandlerManuals(router) {
  const { LABELS, currentName, BASE_URL } = settings.source;

  router.addHandler(LABELS.MANUALS, async ({ request, $, log }) => {
    log.debug(`request.url: ${request.url}`);

    const productsDataset = await Dataset.open(`${currentName}/products`);

    const manualsDataset = await Dataset.open(`${currentName}/manuals`);

    const productsManualsDataset = await Dataset.open(
      `${currentName}/products_manuals`
    );

    const datasets = {
      productsDataset,
      manualsDataset,
      productsManualsDataset,
    };

    const documents = [];

    $(".general-content .contentBlock > .contentBlock").each(
      (_, contentBlock) => {
        let subHeading = $(contentBlock).find(".subHeadings").text().trim();
        if (subHeading === "") {
          subHeading = $(contentBlock).find(".headings").text().trim();
        }

        $(contentBlock)
          .find("a")
          .each((_, link) => {
            let url = $(link).attr("href");
            if (!url.endsWith(".pdf")) return true;
            url = `${BASE_URL}${url}`.replaceAll(" ", "%20");

            const title = $(link).text().trim().replace(".pdf", "");

            documents.push({ title, url, subHeading });
          });
      }
    );

    for (const document of documents) {
      await saveDataToDatasets(datasets, document, settings.source);
    }
  });
}

async function saveDataToDatasets(
  { productsDataset, manualsDataset, productsManualsDataset },
  { title, url, subHeading },
  source
) {
  const currentManualId = manualIdGenerator.next().value;

  const manual = {
    innerId: currentManualId,
    pdfUrl: url,
    title,
    metadata: {
      subHeading,
    },
  };

  const languages = getLanguagesByManual(manual, source);
  manual.language = languages;

  const materialType = getMaterialTypeByManual(manual);
  manual.materialType = materialType;

  await manualsDataset.pushData(manual);

  const productNames = getProductNamesByManual(manual);

  for (const productName of productNames) {
    const product = source.METHODS.pseudoProductForManual(manual);

    const currentProductId = productIdGenerator.next().value;

    product.innerId = currentProductId;
    product.name = productName;

    await productsDataset.pushData(product);

    await productsManualsDataset.pushData({
      productId: currentProductId,
      manualId: currentManualId,
    });
  }
}

function getProductNamesByManual(manual) {
  const AVAILABLE_PRODUCTS_NAMES = [
    "GPZ 7000",
    "GPX 4800 5000",
    "GPX 5000",
    "GPX 6000",
    "ML100 Bluetooth Headphones",
    "SDC 2300",
    "GOLD MONSTER 1000",
    "CTX 3030",
    "Excalibur II",
    "Manticore",
    "MANTICORE",
    "ML105",
    "ML 105",
    "EQUINOX 700 900",
    "ML85 HEADPHONES",
    "EQX 700 900",
    "EQUINOX 600 800",
    "X-TERRA PRO",
    "X-TERRA 705",
    "X-TERRA 305-505",
    "X-TERRA 305/505",
    "X-TERRA 305 505",
    "X-TERRA 305",
    "X-TERRA 705",
    "X-TERRA 70",
    "X-TERRA 30_50",
    "GO-FIND 11 22 44 66",
    "GO-FIND 22 44 66",
    "GO-FIND 11, 22, 44, 66",
    "VANQUISH 340",
    "VANQUISH 440 540",
    "Minelab F3 Countermine Detector",
    "F3 UXO Countermine Detector",
    "F3 Compact Countermine Detector",
    "F3Ci Countermine Detector",
    "STMR II",
    "MDS-10T",
    "MDS-10",
    "MF5",
    "IMC",
    "ML85",
    "ML80",
    "Ml 100",
    "ML 105",
    "ML105",
    "PRO-FIND 15 20 35",
    "PRO-FIND 40",
    "PRO-SWING 45",
    "PRO-GOLD",
    "PRO-SONIC",
    "XChange 2",
    "SilverSaver 1000",
    "E-TRAC XChange",
    "E-Trac",
    "Excalibur 800 1000",
    "Excalibur",
    "Explorer II",
    "Explorer S/XS",
    "Explorer SE",
    "GO-FIND 20, 40, 60",
    "Musketeer Advantage",
    "Musketeer Colt XS / XS Pro",
    "Musketeer XS",
    "Musketeer",
    "Quattro",
    "Relic Hawk",
    "Sovereign Elite",
    "Sovereign",
    "Safari",
    "Eldorado Mark II",
    "Eureka Ace",
    "FT16000",
    "Golden Hawk",
    "Eureka Gold",
    "Goldseeker 15000",
    "GoldStriker",
    "GP Extreme",
    "GP3000",
    "GP3500",
    "GPX-4000",
    "GPX-4500",
    "GT 16000",
    "Klondike",
    "SD2000",
    "SD2100e",
    "SD2100",
    "SD2200d",
    "SD2200v2",
    "X-TERRA 705",
    "PRO-ALLOY",
    "PRO-FIND 25",
  ];

  let findedProductName;

  for (const productName of AVAILABLE_PRODUCTS_NAMES) {
    if (manual.title.includes(productName)) {
      findedProductName = productName;
      break;
    }
  }

  if (!findedProductName) {
    console.log("Manual without detected product name:", manual.title);
  }

  switch (findedProductName) {
    case "GPX 4800 5000":
      return ["GPX 4800", "GPX 5000"];
    case "ML105":
      return ["ML 105"];
    case "Ml 100":
      return ["ML 100"];
    case "EQUINOX 700 900":
    case "EQX 700 900":
      return ["EQUINOX 700", "EQUINOX 900"];
    case "EQUINOX 600 800":
      return ["EQUINOX 600", "EQUINOX 800"];
    case "X-TERRA 305-505":
    case "X-TERRA 305/505":
    case "X-TERRA 305 505":
      return ["X-TERRA 305", "X-TERRA 505"];
    case "X-TERRA 30_50":
      return ["X-TERRA 30", "X-TERRA 50"];
    case "GO-FIND 11 22 44 66":
    case "GO-FIND 11, 22, 44, 66":
      return ["GO-FIND 11", "GO-FIND 22", "GO-FIND 44", "GO-FIND 66"];
    case "GO-FIND 22 44 66":
      return ["GO-FIND 22", "GO-FIND 44", "GO-FIND 66"];
    case "VANQUISH 440 540":
      return ["VANQUISH 440", "VANQUISH 540"];
    case "PRO-FIND 15 20 35":
      return ["PRO-FIND 15", "PRO-FIND 20", "PRO-FIND 35"];
    case "Excalibur 800 1000":
      return ["Excalibur 800", "Excalibur 1000"];
    case "GO-FIND 20, 40, 60":
      return ["GO-FIND 20", "GO-FIND 40", "GO-FIND 60"];
    case "MANTICORE":
      return ["Manticore"];
  }

  return [findedProductName];
}

function getLanguagesByManual(manual, source) {
  const titleLength = manual.title.length;
  const symbols = "()[]- ,";
  const languages = [];

  for (const LANG of source.LANGUAGES) {
    const indexes = findIndexesOfSubstring(manual.title, LANG);

    if (
      indexes.some((index) => {
        let condition = true;

        if (index > 0) {
          condition = condition && symbols.includes(manual.title[index - 1]);
        }

        if (index < titleLength - 3) {
          condition = condition && symbols.includes(manual.title[index + 2]);
        }

        return condition;
      })
    ) {
      languages.push(getLanguageByLangCode(LANG));
    }
  }

  return languages;
}

function getMaterialTypeByManual(manual) {
  const TEXT_OF_TYPES = [
    "Quick Start Guide Timings",
    "Quick Start Guide",
    "Instruction Manual",
    "Instruction manual",
    "instruction manual",
    "Inst Manual",
    "Getting Started Guide",
    "GSG",
    "Field Guide",
    "FieldGuide",
    "Swing Tag",
    "upgrade instructions",
    "Language Reference Guide",
    "Software Update 1 Brochure",
    "Operations Manual",
    "Service Manual",
    "Operator Training",
    "Coil Changeover Instruction",
    "Instruction and Installation Manual",
    "Brochure",
    "Instruction Sheet",
    "User Manual",
    "User Guide",
  ];

  let materialType = "Manual";

  for (const type of TEXT_OF_TYPES) {
    if (manual.title.includes(type)) {
      materialType = type;
      break;
    }
  }

  switch (materialType) {
    case "Instruction manual":
    case "instruction manual":
    case "Instruction Manual":
    case "Inst Manual":
      return "Instruction Manual";
    case "GSG":
      return "Getting Started Guide";
    case "FieldGuide":
      return "Field Guide";
    case "upgrade instructions":
      return "Upgrade Instructions";
    case "Software Update 1 Brochure":
      return "Software Update Brochure";
  }

  return materialType;
}
