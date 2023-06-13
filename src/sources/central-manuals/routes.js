import { Router } from "crawlee";
import addHandlerStart from "./routes/start.js";
import addHandlerManuals from "./routes/manuals.js";

export const router = Router.create();

addHandlerStart(router);
addHandlerManuals(router);

