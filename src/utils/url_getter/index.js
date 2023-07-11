import startSalesforceDownloader from "./salesforce/index.js";
import varSave from "#utils/var_saver.js";
import varRead from "#utils/var_reader.js";
import { URLS_HASH_FILENAME } from "#utils/url_getter/constants.js";
import { SOURCES } from "#utils/globals.js";

export function canUseUrlGetter(url) {
  let domain = new URL(url);
  return domain.host.endsWith(".salesforce.com");
}

export async function addDownloadUrls(sourceKey, urls) {
  try {
    SOURCES[sourceKey].urlsHash = await varRead(
      URLS_HASH_FILENAME,
      SOURCES[sourceKey]
    );
  } catch (err) {
    SOURCES[sourceKey].urlsHash = {};
  }

  const urlsForAdding = urls.filter(
    (url) => canUseUrlGetter(url) && !SOURCES[sourceKey].urlsHash[url]
  );

  try {
    await startSalesforceDownloader(sourceKey, urlsForAdding);
  } catch (err) {
    throw "Error when processing URL";
  }

  await varSave(
    SOURCES[sourceKey].urlsHash,
    URLS_HASH_FILENAME,
    SOURCES[sourceKey]
  );
}
