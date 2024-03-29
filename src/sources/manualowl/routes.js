import { Router } from "crawlee";

import addHandlerSitemap from "./routes/sitemap.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerSitemap(router);
}
