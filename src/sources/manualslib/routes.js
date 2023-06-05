import { Router } from "crawlee";
import addHandlerStart from "./routes/start.js";
import addHandlerBrandGroup from "./routes/brand_group.js";
import addHandlerBrand from "./routes/brand.js";
import addHandlerCategory from "./routes/category.js";
import addHandlerManual from "./routes/manual.js";

export const router = Router.create();

addHandlerStart(router);
addHandlerBrandGroup(router);
addHandlerBrand(router);
addHandlerCategory(router);
addHandlerManual(router);

