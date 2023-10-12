import { Router } from "crawlee";
import addHandlerProducts from "./routes/products.js";
import addHandlerDownloads from "./routes/downloads.js";
import addHandlerManuals from "./routes/manuals.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerProducts(router);
  addHandlerDownloads(router);
  addHandlerManuals(router);
}
