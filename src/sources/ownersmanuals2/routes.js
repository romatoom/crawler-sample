import { Router } from "crawlee";
import addHandlerBrands from "./routes/brands.js";
import addHandlerProducts from "./routes/products.js";
import addHandlerProduct from "./routes/product.js";
import addHandlerManual from "./routes/manual.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerBrands(router);
  addHandlerProducts(router);
  addHandlerProduct(router);
  addHandlerManual(router);
}
