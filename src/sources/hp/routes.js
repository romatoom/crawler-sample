import { Router } from "crawlee";
import addHandlerCategory from "./routes/category.js";
import addHandlerSeries from "./routes/series.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerCategory(router);
  addHandlerSeries(router);
}
