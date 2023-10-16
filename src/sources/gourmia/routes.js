import { Router } from "crawlee";
import addHandlerProducts from "./routes/products.js";
import addHandlerProduct from "./routes/product.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerProducts(router);
  addHandlerProduct(router);
}
