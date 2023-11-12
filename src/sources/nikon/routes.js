import { Router } from "crawlee";

import addHandlerManual from "./routes/manual.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerManual(router);
}
