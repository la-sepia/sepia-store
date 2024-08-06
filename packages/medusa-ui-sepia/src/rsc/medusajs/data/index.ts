import { Order, StoreCartsRes, StoreProductsListRes } from "@medusajs/medusa";

import { medusaClient } from "../config";
import { cookies } from "next/headers";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import { Response } from "@medusajs/medusa-js";

const getMedusaHeaders = (tags: string[] = []) => {
  const headers = {
    next: {
      tags,
    },
  } as Record<string, any>;

  const token = cookies().get("_medusa_jwt")?.value;

  if (token) {
    headers.authorization = `Bearer ${token}`;
  } else {
    headers.authorization = "";
  }

  return headers;
};

// Order actions
export async function retrieveOrder(id: string): Promise<void | Order> {
  const headers = getMedusaHeaders(["order"]);

  return medusaClient.orders
    .retrieve(id, headers)
    .then(({ order }) => order)
    .catch((err) => {});
}

export async function retrieveLookupOrder(id: number, email: string): Promise<void | Order> {
  const headers = getMedusaHeaders(["order"]);

  return medusaClient.orders
    .lookupOrder({ display_id: id, email }, headers)
    .then(({ order }) => order)
    .catch((err) => {});
}

export async function getCart(cartId: string): Promise<StoreCartsRes["cart"] | null> {
  const headers = getMedusaHeaders(["cart"]);

  return medusaClient.carts
    .retrieve(cartId, headers)
    .then(({ cart }) => cart)
    .catch((err) => {
      console.log(err);
      return null;
    });
}

export async function retrieveAvailableProducts(): Promise<string[]> {
  return medusaClient.products
    .list()
    .then(({ products }) => products.map((product) => product.title).filter((title): title is string => title !== undefined))
    .catch((error) => {
      console.error("Error retrieving products:", error);
      return [];
    });
}

export async function getProducts(excludeId: string): Promise<PricedProduct[]> {
  const response = await fetch("http://localhost:9000/store/products?fields=thumbnail");

  const { products } = await medusaClient.products
    .list({ limit: 10, fields: "thumbnail" })
    .then((res) => res)
    .catch(() => ({ products: [] as PricedProduct[], limit: 10, offset: 0, count: 0 }) as Response<StoreProductsListRes>);

  return products.filter(({ id }) => id !== excludeId);
}
