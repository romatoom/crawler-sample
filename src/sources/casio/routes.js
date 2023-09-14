import { Router } from "crawlee";
import addHandlerProduct from "./routes/product.js";
import addHandlerSupportProducts from "./routes/support_products.js";
import addHandlerSupportManuals from "./routes/support_manuals.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerProduct(router);
  addHandlerSupportProducts(router);
  addHandlerSupportManuals(router);
}
