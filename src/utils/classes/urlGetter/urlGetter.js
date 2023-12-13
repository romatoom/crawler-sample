import fs from "fs";
import path from "path";
import { Router, PlaywrightCrawler } from "crawlee";
import { Serializer } from "#utils/classes/serializer.js";

const URLS_HASH_FILENAME = "urls_hash";

export const urlsHashes = {};

export class URLGetter {
  constructor(urls, crawler, cloudsHash) {
    this.urls = urls;
    this.crawler = crawler;
    this.cloudsHash = cloudsHash;
  }

  static async build(urls) {
    const cloudsHash = {};
    const router = Router.create();

    for (const cloudName of fs
      .readdirSync(`src/utils/classes/urlGetter`, {
        withFileTypes: true,
      })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)) {
      for (const routeName of fs
        .readdirSync(`src/utils/classes/urlGetter/${cloudName}`, {
          withFileTypes: true,
        })
        .map((d) => path.parse(d.name).name)) {
        const label = `${cloudName}_${routeName}`;

        cloudsHash[cloudName] = label;

        const { default: routeHandler } = await import(
          `#utils/classes/urlGetter/${cloudName}/${routeName}.js`
        );

        router.addHandler(label, routeHandler());
      }
    }

    const crawler = new PlaywrightCrawler({
      requestHandler: router,
      headless: true,
      maxRequestRetries: 1,
    });

    return new URLGetter(urls, crawler, cloudsHash);
  }

  async getURLsHashes() {
    const serializer = new Serializer("urlGetter");

    try {
      const urlsHashes = await serializer.load(URLS_HASH_FILENAME);
      return urlsHashes;
    } catch (err) {
      const targets = [];

      for (const url of this.urls) {
        for (const cloudName in this.cloudsHash) {
          if (url.includes(cloudName)) {
            targets.push({
              url,
              label: this.cloudsHash[cloudName],
            });
          }
        }
      }

      try {
        await this.crawler.run(targets);
      } catch (err) {
        throw "Error when processing URL";
      }

      await serializer.dump({ urls_hash: urlsHashes });
      return urlsHashes;
    }
  }
}
