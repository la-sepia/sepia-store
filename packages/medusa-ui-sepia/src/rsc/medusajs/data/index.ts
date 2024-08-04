import { Order, StoreCartsRes } from "@medusajs/medusa";

import { medusaClient } from "../config";
import { cookies } from "next/headers";

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
