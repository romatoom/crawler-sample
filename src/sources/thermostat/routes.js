import { Router } from "crawlee";
import addHandlerBrands from "./routes/brands.js";
import addHandlerProducts from "./routes/products.js";
import addHandlerProduct from "./routes/product.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerBrands(router);
  addHandlerProducts(router);
  addHandlerProduct(router);
}
