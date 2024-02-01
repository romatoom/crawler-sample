import state from "#utils/classes/state.js";

export default function routeHandler(source) {
  const { baseURL } = source;

  return async ({ request, log, $ }) => {
    log.debug(`request.url: ${request.url}`);

    const categories = [];
    $(".featured-block__btn").each((_, link) => {
      categories.push({
        slug: $(link).attr("href").replaceAll("/products/", ""),
        name: $(link).text().replaceAll("Browse", "").trim(),
      });
    });

    await state.serializer.dump({ categories });
  };
}
