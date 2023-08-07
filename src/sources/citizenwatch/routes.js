import { Router } from "crawlee";
import addHandlerProductNumbers from "./routes/product_numbers.js";
import addHandlerCollection from "./routes/collection.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerProductNumbers(router);
  addHandlerCollection(router);
}
