import { Router } from "crawlee";
import addHandlerProduct from "./routes/product.js";
import addHandlerManual from "./routes/manual.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerProduct(router);
  addHandlerManual(router);
}
