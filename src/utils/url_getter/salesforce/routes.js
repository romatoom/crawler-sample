import { Router } from "crawlee";
import addHandlerGetPdfUrls from "./routes/get_pdf_urls.js";

export const router = Router.create();

export function addRouterHandlers() {
  addHandlerGetPdfUrls(router);
}
