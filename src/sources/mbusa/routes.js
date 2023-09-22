import { Router } from "crawlee";
import addHandlerManuals from "./routes/manuals.js";
import addHandlerVehicles from "./routes/vehicles.js";
import addHandlerSpecs from "./routes/specs.js";

import addHandlerManualsDouble from "./routes/manuals-double.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerManuals(router);
  addHandlerVehicles(router);
  addHandlerSpecs(router);

  addHandlerManualsDouble(router);
}
