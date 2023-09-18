import startSalesforceDownloader from "./salesforce/index.js";
import varSave from "#utils/var_saver.js";
import varRead from "#utils/var_reader.js";
import { URLS_HASH_FILENAME } from "#utils/url_getter/constants.js";

export function canUseUrlGetter(url) {
  let domain = new URL(url);
  return domain.host.endsWith(".salesforce.com");
}

export async function addDownloadUrls(source, urls) {
  try {
    source.urlsHash = await varRead(URLS_HASH_FILENAME, source);
  } catch (err) {
    source.urlsHash = {};
  }

  const urlsForAdding = urls.filter(
    (url) => canUseUrlGetter(url) && !source.urlsHash[url]
  );

  try {
    await startSalesforceDownloader(urlsForAdding);
  } catch (err) {
    throw "Error when processing URL";
  }

  await varSave(source.urlsHash, URLS_HASH_FILENAME, source);
}
