import { Router } from "crawlee";
import addHandlerLangs from "./routes/langs.js";
import addHandlerSitemap from "./routes/sitemap.js";
import addHandlerProductsList from "./routes/products_list.js";
import addHandlerProduct from "./routes/product.js";

export const router = Router.create();

addHandlerLangs(router);
addHandlerSitemap(router);
addHandlerProductsList(router);
addHandlerProduct(router);
