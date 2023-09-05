import { Router } from "crawlee";
import addHandlerCategory from "./routes/category.js";
import addHandlerProduct from "./routes/product.js";
import addHandlerProductManuals from "./routes/product_manuals.js";
import addHandlerSupport from "./routes/support.js";
import addHandlerSupportManuals from "./routes/support_manuals.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerProduct(router);
  addHandlerCategory(router);
  addHandlerProductManuals(router);
  addHandlerSupport(router);
  addHandlerSupportManuals(router);
}
