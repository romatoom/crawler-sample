import { PlaywrightCrawler, Router } from "crawlee";
import { settings } from "#utils/globals.js";
// import { generateId } from "#utils/generators.js";
import {
  normalizeMatrix,
  printMatrix,
  lettersMatrixs,
  letterToKey,
} from "./captcha_solver.js";

import varSave from "#utils/var_saver.js";
import varRead from "#utils/var_reader.js";

import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

// const idGenerator = generateId(0);

let lettersHash = await varRead("letters", settings.source);

async function prepareCaptchaData() {
  const { BASE_URL, LABELS } = settings.source;

  const router = Router.create();

  router.addHandler(
    LABELS.DOWNLOAD_MANUAL,
    async ({ log, request, page, parseWithCheerio }) => {
      await page.waitForSelector(".captchatable tbody");
      const $ = await parseWithCheerio();

      const captchaRows = $(".captchatable tbody tr");

      let captchaMatrix = [];

      for (const row of captchaRows) {
        const rowCells = $(row).find("td");
        const matrixRow = [];

        for (const cell of rowCells) {
          const cellElem = $(cell).attr("class");
          const value = cellElem === "capc1" ? 0 : 1;
          matrixRow.push(value);
        }

        captchaMatrix.push(matrixRow);
      }

      captchaMatrix = normalizeMatrix(captchaMatrix);

      const matrix4letters = lettersMatrixs(captchaMatrix);

      matrix4letters.forEach((letter) => {
        const key = letterToKey(letter);

        if (!(key in lettersHash)) {
          lettersHash[key] = {
            value: undefined,
            letter,
          };
        }
      });
    }
  );

  const crawler = new PlaywrightCrawler({
    requestHandler: router,
  });

  // const MAX_TRIES = 10;
  // let tryCount = 1;

  while (Object.keys(lettersHash).length < 24 /* && tryCount <= MAX_TRIES */) {
    await crawler.run([
      {
        url: `${BASE_URL}/m/Samsung/SSG-4100GB/Download/422836`,
        label: LABELS.DOWNLOAD_MANUAL,
      },
    ]);

    //tryCount++;
  }

  varSave(lettersHash, `letters`, settings.source);
}

await prepareCaptchaData();

const rl = readline.createInterface({ input, output });

console.log("Start character recognition process");

for (const [key, obj] of Object.entries(lettersHash)) {
  if (!obj.value) {
    printMatrix(obj.letter);
    const symbol = await rl.question("What is it symbol? ");
    obj.value = symbol;
  }
}

console.log(`${Object.keys(lettersHash).length} characters recognized`);

rl.close();

varSave(lettersHash, `letters`, settings.source);
