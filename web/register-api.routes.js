import { shopApiRoutes } from "./src/shop/shopi.api.routes.js";

const DEFAULT_API_PREFIX = "/api/v1";
const ADMIN_API_PREFIX = `${DEFAULT_API_PREFIX}/admin`;
const PLAN_CONFIRMATION_PREFIX = `${DEFAULT_API_PREFIX}/plan-confirmation`;

export const registerApiRoutes = (app) => {
  app.use(`${DEFAULT_API_PREFIX}/shop`, shopApiRoutes);
};

export const registerPlanConfirmationRoutes = (app) => {};

export const registerAdminRoutes = (app) => {};
