import express from "express";
import { shopController } from "./shop.controller.js";
import { errorHandler } from "../middleware/index.js";

const router = new express.Router();

router.get("/", errorHandler(shopController.getShop));

export const shopApiRoutes = router;
