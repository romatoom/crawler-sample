import { settings } from "#utils/globals.js";

export default function addHandlerCollection(router) {
  const { LABELS, BASE_URL } = settings.source;

  router.addHandler(
    LABELS.COLLECTION,
    async ({ request, page, log, crawler, parseWithCheerio }) => {
      log.debug(`request.url: ${request.url}`);
      const { collection } = request.userData.data;

      
    }
  );
}
