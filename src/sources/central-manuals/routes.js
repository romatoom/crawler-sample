import { Router } from "crawlee";
import addHandlerStart from "./routes/start.js";
import addHandlerCategory from "./routes/category.js";
import addHandlerManuals from "./routes/manuals.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerStart(router);
  addHandlerCategory(router);
  addHandlerManuals(router);
}


