import { Router } from "crawlee";
import addHandlerProduct from "./routes/product.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerProduct(router);
}
