import { Router } from "crawlee";
import addHandlerProducts from "./routes/products.js";
import addHandlerProduct from "./routes/product.js";
import addHandlerManuals from "./routes/manuals.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerProducts(router);
  addHandlerProduct(router);
  addHandlerManuals(router);
}
