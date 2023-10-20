import { Router } from "crawlee";
import addHandlerCategories from "./routes/categories.js";
import addHandlerProducts from "./routes/products.js";
import addHandlerProduct from "./routes/product.js";

import addHandlerStoryCategories from "./routes/story_categories.js";
import addHandlerStoryProducts from "./routes/story_products.js";
import addHandlerStoryProduct from "./routes/story_product.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerCategories(router);
  addHandlerProducts(router);
  addHandlerProduct(router);

  addHandlerStoryCategories(router);
  addHandlerStoryProducts(router);
  addHandlerStoryProduct(router);
}
