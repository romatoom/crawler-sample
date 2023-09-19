import { Router } from "crawlee";
import addHandlerCategories from "./routes/categories.js";
import addHandlerProductsList from "./routes/products_list.js";
import addHandlerProduct from "./routes/product.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerCategories(router);
  addHandlerProductsList(router);
  addHandlerProduct(router);
}
