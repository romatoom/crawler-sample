import fs from "fs";
import * as fsAsync from "node:fs/promises";

import pkg from "core-js/actual/array/group-by.js";
import uniqWith from "lodash/uniqWith.js";
import merge from "lodash/merge.js";
import { addDownloadUrls } from "#utils/url_getter/index.js";

import { SOURCES_WITH_NEED_REPLACE_URL } from "#utils/globals.js";

const { groupBy } = pkg;

import { log } from "crawlee";

import { Product } from "#utils/classes/product.js";
import { Manual } from "#utils/classes/manual.js";
import { ProductManual } from "#utils/classes/productManual.js";

import state from "#utils/classes/state.js";

export class DataPreparer {
  constructor(source) {
    this.source = source;
  }

  prepareManuals(manuals) {
    const groupedManuals = manuals.groupBy((manual) => manual.data.pdfUrl);

    let preparedManuals = [];
    const idsForReplace = {};

    for (const [_, manuals] of Object.entries(groupedManuals)) {
      const manual = manuals.find((m) => m.data.language === "English") || {
        ...manuals[0],
      };

      // Set languages

      let languages = [];

      for (const manualItem of manuals) {
        if (Array.isArray(manualItem.data.language)) {
          languages.push(...manualItem.data.language);
        } else {
          languages.push(manualItem.data.language);
        }
      }

      languages = [...new Set(languages)];

      delete manual.data.language;
      manual.data.languages = languages;

      //////////

      if ("joinTitles" in this.source) {
        const titles = [...new Set(manuals.map((manual) => manual.data.title))];
        manual.data.title =
          titles.length === 1 ? titles[0] : this.source.joinTitles(titles);
      }

      preparedManuals.push(manual);

      if (!("referenceExist" in this.source)) {
        manuals.forEach((m) => {
          idsForReplace[m.innerId] = manual.data.innerId;
        });
      }
    }

    return { preparedManuals, idsForReplace };
  }

  prepareProducts(products) {
    const idsForReplace = {};
    const preparedProducts = [];

    for (const product of products) {
      let existedProduct = preparedProducts.find((p) =>
        Product.equals(p, product)
      );

      if (existedProduct) {
        idsForReplace[product.data.innerId] = existedProduct.data.innerId;

        // объединение данных

        existedProduct.data.images = [
          ...new Set([...existedProduct["images"], ...product.data.images]),
        ];

        existedProduct.data.metadata = merge(
          existedProduct.data.metadata,
          product.data.metadata
        );

        const specs = [];

        for (const spec of [
          ...existedProduct.data.specs,
          ...product.data.specs,
        ]) {
          const specsExists = specs.find(
            (s) => s.group === spec.group && s.label === spec.label
          );

          if (!specsExists) {
            specs.push(spec);
          }
        }

        existedProduct.data.specs = [...specs];

        //////
      } else {
        preparedProducts.push(product);
      }
    }

    return {
      preparedProducts,
      idsForReplace,
    };
  }

  prepareProductsManuals(
    productsManuals,
    productsIdsForReplace,
    manualsIdsForReplace
  ) {
    const preparedProductsManuals = productsManuals.map((productManual) => {
      const { productId, manualId } = { ...productManual.data };

      if (productsIdsForReplace[productId])
        productManual.data.productId = productsIdsForReplace[productId];

      if (manualsIdsForReplace[manualId])
        productManual.data.manualId = manualsIdsForReplace[manualId];

      return productManual;
    });

    return uniqWith(preparedProductsManuals, ProductManual.equals);
  }

  productsManualsReferences(products, manuals, preparedProductsManuals) {
    log.info(`Prepare products-manuals references.`);

    const references = [];

    let manualsIdsWithReference = [];

    for (const product of products) {
      for (const manual of manuals) {
        const existsFromReferences = preparedProductsManuals.find(
          (pm) =>
            pm.data.productId === product.data.innerId &&
            pm.data.manualId === manual.data.innerId
        );

        if (existsFromReferences) {
          manualsIdsWithReference.push(manual.data.innerId);
        } else if (this.source.referenceExist(product, manual)) {
          references.push({
            productId: product.data.innerId,
            manualId: manual.data.innerId,
          });

          manualsIdsWithReference.push(manual.data.innerId);
        }
      }
    }

    manualsIdsWithReference = [...new Set(manualsIdsWithReference)];

    const newProducts = [];

    // Добавляем псевдо-продукты
    if ("pseudoProductForManual" in this.source) {
      for (const manual of manuals) {
        if (!manualsIdsWithReference.includes(manual.data.innerId)) {
          const pseudoProduct = this.source.pseudoProductForManual(manual);
          const productName = pseudoProduct.data.name;

          const product = newProducts.find((p) => p.data.name === productName);

          if (!product) {
            const productId = productIdGenerator.next().value;

            newProducts.push({
              pseudoProduct,
            });

            references.push({
              productId: pseudoProduct.data.productId,
              manualId: manual.data.innerId,
            });
          } else {
            references.push({
              productId: product.data.innerId,
              manualId: manual.data.innerId,
            });
          }
        }
      }
    }

    return { references, newProducts };
  }

  async manualsWithReplacedUrls(manuals) {
    const urls = manuals.map((m) => m.data.pdfUrl);
    await addDownloadUrls(this.source, urls);

    return manuals.map((m) => {
      m.data.pdfUrl = this.source.urlsHash[m.data.pdfUrl] || m.data.pdfUrl;
      return m;
    });
  }

  clearedProducts(productsManuals, products) {
    const existedProductIDs = [
      ...new Set(productsManuals.map((pm) => pm.data.productId)),
    ];
    return products.filter((p) => existedProductIDs.includes(p.data.innerId));
  }

  async getPreparedData() {
    log.info("Prepare and receive data.");

    console.log("Read manuals from output file");
    const rawDataManuals = fs.readFileSync(state.paths.pathOfEntity("manuals"));
    let manuals = JSON.parse(rawDataManuals).map((data) => new Manual(data));

    if (
      SOURCES_WITH_NEED_REPLACE_URL.includes(this.source.name.toUpperCase())
    ) {
      manuals = await this.manualsWithReplacedUrls(manuals);
    }

    console.log("Read products from output file");
    const rawDataProducts = fs.readFileSync(
      state.paths.pathOfEntity("products")
    );
    const products = JSON.parse(rawDataProducts).map(
      (data) => new Product(data)
    );

    console.log("Prepare products from output file");
    const { preparedProducts, idsForReplace: productsIdsForReplace } =
      this.prepareProducts(products);

    console.log("Prepare manuals from output file");
    const { preparedManuals, idsForReplace: manualsIdsForReplace } =
      this.prepareManuals(manuals);

    let preparedProductsManuals = [];

    console.log("Prepare products-manuals from output file");

    const rawDataProductsManuals = fs.readFileSync(
      state.paths.pathOfEntity("products_manuals")
    );

    const productsManuals = JSON.parse(rawDataProductsManuals).map(data => new ProductManual(data));

    if (productsManuals.length > 0) {
      preparedProductsManuals = this.prepareProductsManuals(
        productsManuals,
        productsIdsForReplace,
        manualsIdsForReplace
      );
    }

    if ("referenceExist" in this.source) {
      const { references, newProducts } = this.productsManualsReferences(
        preparedProducts,
        preparedManuals,
        preparedProductsManuals
      );

      preparedProductsManuals = [...preparedProductsManuals, ...references];
      preparedProducts.push(...newProducts);
    }

    return {
      products: this.clearedProducts(preparedProductsManuals, preparedProducts),
      manuals: preparedManuals,
      productsManuals: preparedProductsManuals,
    };
  }

  async getPreparedDataWithRange(
    productsRange,
    manualsRange,
    productsManualsRange
  ) {
    log.info("Prepare and receive data.");

    ///

    console.log("Read manuals");

    const promises = [];

    for (const id of manualsRange) {
      const filename = `${id.toString().padStart(9, "0")}.json`;

      promises.push(
        fsAsync.readFile(
          `${state.paths.pathOfEntityDataset("manuals")}/${filename}`,
          {
            encoding: "utf8",
          }
        )
      );
    }

    const manuals = (await Promise.all(promises)).map(
      (m) => new Manual(JSON.parse(m))
    );

    if (
      SOURCES_WITH_NEED_REPLACE_URL.includes(this.source.name.toUpperCase())
    ) {
      manuals = await this.manualsWithReplacedUrls(manuals);
    }

    ///

    console.log("Read products");

    promises.length = 0;

    for (const id of productsRange) {
      const filename = `${id.toString().padStart(9, "0")}.json`;

      promises.push(
        fsAsync.readFile(
          `${state.paths.pathOfEntityDataset("products")}/${filename}`,
          {
            encoding: "utf8",
          }
        )
      );
    }

    const products = (await Promise.all(promises)).map(
      (p) => new Product(JSON.parse(p))
    );

    ////

    console.log("Read products_manuals");

    promises.length = 0;

    for (const id of productsManualsRange) {
      const filename = `${id.toString().padStart(9, "0")}.json`;

      promises.push(
        fsAsync.readFile(
          `${state.paths.pathOfEntityDataset("products_manuals")}/${filename}`,
          {
            encoding: "utf8",
          }
        )
      );
    }

    const productsManuals = (await Promise.all(promises)).map(
      (p) => new ProductManual(JSON.parse(p))
    );

    ///

    console.log("Prepare products");
    const { preparedProducts, idsForReplace: productsIdsForReplace } =
      this.prepareProducts(products);

    ///

    console.log("Prepare manuals");
    const { preparedManuals, idsForReplace: manualsIdsForReplace } =
      this.prepareManuals(manuals);

    ///

    console.log("Prepare products_manuals");

    let preparedProductsManuals = [];

    if (productsManuals.length > 0) {
      preparedProductsManuals = this.prepareProductsManuals(
        productsManuals,
        productsIdsForReplace,
        manualsIdsForReplace
      );
    }

    if ("referenceExist" in this.source) {
      const { references, newProducts } = this.productsManualsReferences(
        preparedProducts,
        preparedManuals,
        preparedProductsManuals
      );

      preparedProductsManuals = [...preparedProductsManuals, ...references];
      preparedProducts.push(...newProducts);
    }

    ///

    return {
      products: this.clearedProducts(preparedProductsManuals, preparedProducts),
      manuals: preparedManuals,
      productsManuals: preparedProductsManuals,
    };
  }
}
