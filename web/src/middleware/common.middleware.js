import { shopService } from "../shop/shop.service.js";

export const commonMiddleware = async (req, res, next) => {
  const session = res.locals.shopify.session;
  const shop = await shopService.findByName(session.shop);
  if (!shop)
    return res.status(404).send({ success: false, message: "Shop Not Found" });

  req.session = session;
  req.shop = shop;
  return next();
};
