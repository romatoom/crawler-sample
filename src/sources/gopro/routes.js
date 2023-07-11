import { Router } from "crawlee";
import addHandlerProductsManuals from "./routes/products_manuals.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerProductsManuals(router);
}
