import { Router } from "crawlee";
import addHandlerLangs from "./routes/langs.js";
import addHandlerSitemap from "./routes/sitemap.js";

export const router = Router.create();

addHandlerLangs(router);
addHandlerSitemap(router);
