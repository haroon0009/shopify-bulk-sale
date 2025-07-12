class ShopController {
  constructor() {}

  async getShop(req, res) {
    const shop = req.shop;
    return res.status(200).json({ shop, success: true });
  }
}

export const shopController = new ShopController();
