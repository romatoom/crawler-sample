import { Router } from "crawlee";
import addHandlerProduct from "./routes/product.js";
import addHandlerStartUserGuides from "./routes/start_user_guides.js";
import addHandlerUserGuid from "./routes/user_guid.js";
import addHandlerProductSpecs from "./routes/product_specs.js";

export const router = Router.create();

addHandlerProduct(router);
addHandlerStartUserGuides(router);
addHandlerUserGuid(router);
addHandlerProductSpecs(router);
