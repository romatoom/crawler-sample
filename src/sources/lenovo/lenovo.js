import { PlaywrightCrawler, CheerioCrawler, log } from "crawlee";

import { Source } from "#utils/classes/source.js";
import state from "#utils/classes/state.js";

import { BASE_MANUAL_TITLE_JOINER } from "#utils/formatters.js";

// import { OppoAPI } from "./api.js";

export default class LenovoSource extends Source {
  baseURL = "https://pcsupport.lenovo.com/us/en";
  brand = "Lenovo";
  name = "lenovo";

  joinTitles = BASE_MANUAL_TITLE_JOINER;

  langs = {
    ar: "العربية",
    bg: "Български език",
    cs: "Čeština",
    da: "Dansk",
    de: "Deutsch",
    el: "Ελληνικά",
    en: "English",
    es: "Español (Latin America)",
    "es-es": "Español",
    et: "Eesti",
    fi: "Suomi",
    fr: "Français",
    he: "עברית",
    hr: "Hrvatski jezik",
    hu: "Magyar",
    id: "Bahasa Indonesia",
    it: "Italiano",
    ja: "日本語",
    ko: "한국어",
    lt: "Lietuvių kalba",
    lv: "Latviešu valoda",
    nb: "Norsk bokmål",
    nl: "Nederlands",
    pl: "Język Polski",
    pt: "Português do Brasil",
    "pt-pt": "Português",
    ro: "Limba Română",
    ru: "Русский",
    sk: "Slovenčina",
    sl: "Slovenski",
    sr: "Srpski",
    sv: "Svenska",
    th: "ไทย",
    tr: "Türkçe",
    uk: "Українська",
    zc: "中文简体",
    zh: "中文繁體",
  };

  constructor() {
    super();
  }

  async init() {
    await this.addRoutes();

    log.info(`Setting up crawler for "${this.baseURL}"`);

    this.playwrightCrawler = new PlaywrightCrawler({
      requestHandler: this.router,
      headless: true,
      requestHandlerTimeoutSecs: 500000,
      maxRequestRetries: 1,
      maxRequestsPerMinute: 60,
    });

    this.cheerioCrawler = new CheerioCrawler({
      requestHandler: this.router,
      minConcurrency: 1,
      maxConcurrency: 5,
      maxRequestsPerMinute: 120,
    });

    return this;
  }

  async parse() {
    log.info("Adding requests to the queue.");

    let productsData;

    try {
      productsData = await state.serializer.load("productsData", {
        append: true,
      });
    } catch (err) {
      await this.parseSupport();

      productsData = await state.serializer.load("productsData", {
        append: true,
      });
    }

    await this.parseProducts(productsData);
  }

  async parseSupport() {
    await this.playwrightCrawler.run([
      {
        url: this.baseURL,
        label: "SUPPORT",
      },
    ]);
  }

  async parseProducts(productsData) {
    const targets = productsData.map((pd) => ({
      url: `${this.baseURL}/products/${pd.partOfURL}/document-userguide/doc_userguide`,
      label: "PRODUCT",
      userData: {
        data: {
          series: pd.seriesTitle,
          name: pd.subseriesTitle,
          category: pd.category,
        },
      },
    }));

    let successedURLs;
    try {
      successedURLs = await state.serializer.load("successedURLs", {
        append: true,
      });
    } catch {
      successedURLs = [];
    }

    await this.cheerioCrawler.run(
      targets.filter(
        (t) =>
          !successedURLs.includes(t.url)
      )
    );
  }

  async start() {
    await this.parseDecorator(this.parse.bind(this), {
      // onlyParse: true,
      // dropDatasets: false,
    });
  }
}
