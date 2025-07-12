import { shopService } from "../shop/shop.service.js";

class Session {
  async storeSession(session) {
    console.log("STORING SESSION", session);
    return await shopService.storeOrUpdateSession(session);
  }

  async loadSession(id) {
    console.log("LOADING SESSION", id);
    const shop = await shopService.findByName(id.replace("offline_", ""));
    if (!shop || !shop.accessToken) return false;

    const session = shopService.convertShopToSession(shop);
    return session;
  }

  async deleteSession(id) {
    return true;
  }

  async deleteSessions(ids) {
    return true;
  }

  async findSessionsByShop(shop) {
    console.log("FINDING SESSIONS BY SHOP", shop);
    const shopExist = await shopService.findByName(shop);
    if (!shopExist) return [];
    return [shopService.convertShopToSession(shopExist)];
  }
}

export const SessionStorage = new Session();
