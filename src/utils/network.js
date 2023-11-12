const MAX_TRIES = 3;

export async function with_attempts(callback, maxTries = MAX_TRIES) {
  let result;
  let tryCount = 1;

  while (tryCount <= maxTries) {
    try {
      result = await callback;
      return result;
    } catch (err) {
      tryCount++;
    }
  }

  if (tryCount > maxTries) {
    throw new Error("Number of attempts exceeded");
  }

  return result;
}
