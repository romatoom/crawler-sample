import { log, sleep } from "crawlee";
import { exportDataToSqliteWithRange } from "#utils/exporter.js";
import { dropDatasets, exportDatasets } from "#utils/datasets.js";
import { settings } from "#utils/globals.js";
import { setGenerators } from "#utils/generators.js";
import varRead from "#utils/var_reader.js";

import varSave from "#utils/var_saver.js";

import {
  selectProductCategory,
  getAllProducts,
  getManualsForProduct,
  getSuperCategories,
  getCategoryList,
  getSubcategoryList,
  getModelsList,
  getManualsForModel,
} from "./api_utils.js";

import { with_attempts } from "#utils/network.js";
import pkg from "core-js/actual/array/group-by.js";

const { groupBy } = pkg;

export default async function start() {
  const { BASE_URL, LABELS, LANGS, LOCALES, LOCALE_CATEGORIES } =
    settings.source;

  log.setLevel(log.LEVELS.DEBUG);
  log.info(`Setting up crawler for "${BASE_URL}"`);

  await dropDatasets();

  await setGenerators(settings.source);

  let products;
  try {
    products = await varRead("products", settings.source);
  } catch {
    let categories;

    try {
      categories = await varRead("categories", settings.source);
    } catch {
      categories = await selectProductCategory();
    }

    products = await getAllProducts(categories);
  }

  for (const product of products) {
    await getManualsForProduct(product);
  }

  const langsCount = Object.keys(LOCALES).length;

  let models = [];
  try {
    models = await varRead("models", settings.source, "arrayWithoutBrackets");
  } catch {
    let count = 0;

    for (const locale in LOCALES) {
      console.log(
        `Language ${LOCALES[locale].lang}. ${++count} of ${langsCount}`
      );

      let superCategoriesHash;

      try {
        superCategoriesHash = await with_attempts(getSuperCategories(locale));
      } catch (err) {
        continue;
      }

      for (const superCategory in superCategoriesHash) {
        console.log(`Category: ${superCategory}`);

        const superCategoryId = superCategoriesHash[superCategory];

        let categoryList;
        try {
          categoryList = await with_attempts(
            getCategoryList(superCategoryId, locale)
          );
        } catch (err) {
          continue;
        }

        for (const category of categoryList) {
          for (const categoryId in category) {
            const categoryName = category[categoryId];

            let subCategoryList;
            try {
              subCategoryList = await with_attempts(
                getSubcategoryList(superCategoryId, categoryId, locale)
              );
            } catch (err) {
              continue;
            }

            if (subCategoryList.length > 0) {
              for (const subCategory of subCategoryList) {
                const subCateId = Object.keys(subCategory)[0];

                let modelsList;
                try {
                  modelsList = await with_attempts(
                    getModelsList(
                      superCategoryId,
                      categoryId,
                      subCateId,
                      locale
                    )
                  );
                } catch (err) {
                  continue;
                }

                for (const modelHash of modelsList) {
                  const obj = {
                    model: Object.keys(modelHash)[0],
                    locale,
                    superCategoryId,
                    categoryId,
                    subCateId,
                    superCategory,
                    categoryName,
                  };

                  varSave([obj], "models", settings.source, "append", "array");
                }
              }
            } else {
              let modelsList;
              try {
                modelsList = await with_attempts(
                  getModelsList(superCategoryId, categoryId, null, locale)
                );
              } catch (err) {
                continue;
              }

              for (const modelHash of modelsList) {
                const obj = {
                  model: Object.keys(modelHash)[0],
                  locale,
                  superCategoryId,
                  categoryId,
                  subCateId: null,
                  superCategory,
                  categoryName,
                };

                varSave([obj], "models", settings.source, "append", "array");
              }
            }
          }
        }
      }
    }

    models = await varRead("models", settings.source, "arrayWithoutBrackets");
  }

  const modelsCount = models.length;

  const indexesWithError = [];

  for (const [index, model] of models.entries()) {
    // if (index < 103935) continue;

    try {
      await with_attempts(getManualsForModel(model));
    } catch (err) {
      console.log(err.message);

      if (err.message === "Number of attempts exceeded") {
        varSave(
          [index],
          "indexesWithError",
          settings.source,
          "append",
          "array"
        );
        continue;
      }

      break;
    }

    console.log(`Try parsed ${index + 1} of ${modelsCount} finished`);
  }

  await exportDatasets();
  await exportDataToSqliteWithRange();
}
