import { PrismaClient } from "../generated/prisma/index.js";
// import { Session } from "@shopify/shopify-api/dist/cjs/lib/session/session.js";
import { Session } from "@shopify/shopify-api";

import shopifyConfig from "../config/shopify-config.js";

class ShopService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async storeOrUpdateSession(session) {
    const { shop, accessToken, scope, state, id } = session;
    const shop_exist = await this.findByName(shop);

    // checking the shop scope and accessToken if the shop already existed
    if (shop_exist && shop_exist.status === "active") {
      if (
        shop_exist.accessToken !== accessToken ||
        shop_exist.scope !== scope
      ) {
        await this.update(shop_exist.id, {
          scope: scope,
          accessToken: accessToken,
          session_state: state,
          session_id: id,
        });
      }
      return true;
    }

    const client = new shopifyConfig.api.clients.Graphql({
      session: session,
    });

    const gqpResponse = await client.request(`
   #graphql
    query shopInfo {
  shop {
  id
    name
    url
    myshopifyDomain
    contactEmail
    currencyCode
    email
    currencyCode
    billingAddress{
      address1
      address2
      company
      country
      province
      city
    }
  }
}
`);

    const shopifyShopDetails = gqpResponse.data.shop;
    console.log(shopifyShopDetails);

    // creating new shop
    const newShop = await this.prisma.shop.create({
      data: {
        shop_name: shop,
        accessToken,
        scope,
        session_state: state,
        session_id: id,
        shopify_shop_id: shopifyShopDetails.id,
        name: shopifyShopDetails.name,
        status: "ACTIVE",
        email: shopifyShopDetails.contactEmail,
        address1: shopifyShopDetails.billingAddress.address1,
        address2: shopifyShopDetails.billingAddress.address2,
        city: shopifyShopDetails.billingAddress.city,
        country: shopifyShopDetails.billingAddress.country,
        province: shopifyShopDetails.billingAddress.province,
      },
    });

    return newShop;
  }

  convertShopToSession(shop) {
    const { session_id, shop_name, session_state, accessToken, scope } = shop;

    return Session.fromPropertyArray(
      Object.entries({
        id: session_id,
        shop: shop_name,
        state: session_state,
        accessToken,
        scope,
        isOnline: false,
      })
    );
  }

  async findByName(shopName) {
    return this.prisma.shop.findUnique({
      where: {
        shop_name: shopName,
      },
    });
  }

  async getOne(id) {
    return this.prisma.shop.findUnique({
      where: {
        id,
      },
    });
  }

  async create(shop) {
    return this.prisma.shop.create({
      data: shop,
    });
  }

  async update(shop_id, shop) {
    return this.prisma.shop.update({
      where: {
        id: shop_id,
      },
      data: shop,
    });
  }
}

export const shopService = new ShopService();
