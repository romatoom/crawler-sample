import { Router } from "crawlee";
import addHandlerMain from "./routes/main.js";
import addHandlerProducts from "./routes/products.js";
import addHandlerProduct from "./routes/product.js";
import addHandlerManuals from "./routes/manuals.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerMain(router);
  addHandlerProducts(router);
  addHandlerProduct(router);
  addHandlerManuals(router);
}
