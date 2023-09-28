import { Router } from "crawlee";

import addHandlerManuals from "./routes/manuals.js";

/*
import addHandlerProducts from "./routes/products.js";
import addHandlerProduct from "./routes/product.js";
import addHandlerGoFindProducts from "./routes/go_find_products.js";
import addHandlerGoFindProduct from "./routes/go_find_product.js";
*/

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerManuals(router);
  /*
  addHandlerProducts(router);
  addHandlerProduct(router);
  addHandlerGoFindProducts(router);
  addHandlerGoFindProduct(router);
  */
}
