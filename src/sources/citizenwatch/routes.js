import { Router } from "crawlee";
import addHandlerCollection from "./routes/collection.js";
import addHandlerProduct from "./routes/product.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerCollection(router);
  addHandlerProduct(router);
}
