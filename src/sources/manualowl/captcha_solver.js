import varRead from "#utils/var_reader.js";
import varSave from "#utils/var_saver.js";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { SOURCES } from "#utils/globals.js";

export function printMatrix(captchaMatrix) {
  const { rowsCount, colsCount } = matrixSize(captchaMatrix);
  let rowStr = "";

  for (let i = 0; i <= colsCount - 1; i++) {
    for (let j = 0; j <= rowsCount - 1; j++) {
      const char = captchaMatrix[j][i] === 1 ? "▮" : " ";
      rowStr = rowStr + char;
    }
    rowStr = rowStr + "\n";
  }

  console.log(rowStr);
}

function matrixSize(matrix) {
  return {
    rowsCount: matrix.length,
    colsCount: matrix[0].length,
  };
}

export function normalizeMatrix(initialMatrix) {
  const { rowsCount, colsCount } = matrixSize(initialMatrix);

  let normalizedMatrix = new Array();
  normalizedMatrix.length = colsCount;

  for (let [j, col] of normalizedMatrix.entries()) {
    normalizedMatrix[j] = new Array();
    normalizedMatrix[j].length = rowsCount;
  }

  const needInvert = initialMatrix[0][0] !== 0;

  for (const [j, row] of initialMatrix.entries()) {
    for (const [i, cell] of row.entries()) {
      normalizedMatrix[i][j] = needInvert ? 1 - cell : cell;
    }
  }

  return normalizedMatrix;
}

export function lettersMatrixs(captchaMatrix) {
  function itEmptyCol(colPos) {
    return captchaMatrix[colPos].every((cell) => cell === 0);
  }

  const { rowsCount } = matrixSize(captchaMatrix);

  // Проходим по всем столбцам и ищем границы символов капчи
  const letters = [];

  let letter = [];
  let previousColEmpty = true;

  for (let i = 0; i <= rowsCount - 1; i++) {
    if (!itEmptyCol(i)) {
      letter.push(captchaMatrix[i]);

      previousColEmpty = false;
    } else if (!previousColEmpty) {
      letters.push(letter);
      letter = [];
      previousColEmpty = true;
    }
  }

  return letters;
}

export function letterToKey(letterMatrix) {
  let key = "";

  for (const col of letterMatrix) {
    for (const cell of col) {
      key = key + cell;
    }
  }
  return key;
}

export async function solveCaptcha(captchaMatrix) {
  const lettersHash = await varRead("letters", SOURCES.MANUALOWL);

  const letters = lettersMatrixs(captchaMatrix);

  let solve = "";

  for (const letter of letters) {
    const key = letterToKey(letter);

    if (!key || !lettersHash[key].value) {
      const rl = readline.createInterface({ input, output });

      console.warn("Unidentified character:");
      printMatrix(letter);

      const symbol = await rl.question("What is it symbol? ");

      lettersHash[key] = {
        letter,
        value: symbol,
      };

      rl.close();
    }

    solve += lettersHash[key].value;
  }

  varSave(lettersHash, `letters`, SOURCES.MANUALOWL);

  return solve;
}
