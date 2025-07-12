-- CreateTable
CREATE TABLE "shop" (
    "id" TEXT NOT NULL,
    "shop_name" TEXT NOT NULL,
    "shopify_shop_id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "session_state" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "name" TEXT,
    "status" TEXT NOT NULL,
    "logo" TEXT,
    "email" TEXT,
    "address1" TEXT,
    "address2" TEXT,
    "city" TEXT,
    "country" TEXT NOT NULL DEFAULT 'United States',
    "province" TEXT,
    "uninstalled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shop_shop_name_key" ON "shop"("shop_name");

-- CreateIndex
CREATE UNIQUE INDEX "shop_shopify_shop_id_key" ON "shop"("shopify_shop_id");
