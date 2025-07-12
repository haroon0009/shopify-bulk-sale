import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopifyConfig from "./src/config/shopify-config.js";
import PrivacyWebhookHandlers from "./privacy.js";
import {
  commonMiddleware,
  globalErrorMiddleware,
} from "./src/middleware/index.js";
import {
  registerApiRoutes,
  registerAdminRoutes,
  registerPlanConfirmationRoutes,
} from "./register-api.routes.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

BigInt.prototype.toJSON = function () {
  return Number(this);
};

registerPlanConfirmationRoutes(app);

// Set up Shopify authentication and webhook handling
app.get(shopifyConfig.config.auth.path, shopifyConfig.auth.begin());
app.get(
  shopifyConfig.config.auth.callbackPath,
  shopifyConfig.auth.callback(),
  shopifyConfig.redirectToShopifyOrAppRoot()
);
app.post(
  shopifyConfig.config.webhooks.path,
  shopifyConfig.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js
app.use(express.json());

registerAdminRoutes(app);
app.use("/api/*", shopifyConfig.validateAuthenticatedSession());
app.use("/api/*", commonMiddleware);
registerApiRoutes(app);

app.use(shopifyConfig.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use(
  "/*",
  shopifyConfig.ensureInstalledOnShop(),
  async (_req, res, _next) => {
    return res
      .status(200)
      .set("Content-Type", "text/html")
      .send(
        readFileSync(join(STATIC_PATH, "index.html"))
          .toString()
          .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
      );
  }
);

app.use(globalErrorMiddleware);

function startServer() {
  app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
}

startServer();
