import { Router } from "crawlee";
import addHandlerCategories from "./routes/categories.js";
import addHandlerProduct from "./routes/product.js";

import addHandlerEnterpriseCategories from "./routes/enterprise-categories.js";
import addHandlerEnterpriseProduct from "./routes/enterprise-product.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerCategories(router);
  addHandlerProduct(router);

  addHandlerEnterpriseCategories(router);
  addHandlerEnterpriseProduct(router);
}
