import state from "#utils/classes/state.js";

export default function routeHandler(source) {
  const { category, baseURL } = source;

  return async ({ request, log, $, crawler }) => {
    log.debug(`request.url: ${request.url}`);

    const locales = {};

    $(".language a").each((_, localeBlock) => {
      const locale = $(localeBlock)
        .attr("href")
        .replace(`${baseURL}/`, "")
        .replace("/", "");

      const language = $(localeBlock).find("span.lang").text().trim();
      locales[locale] = language;
    });

    await state.serializer.dump({ locales });
  };
}
