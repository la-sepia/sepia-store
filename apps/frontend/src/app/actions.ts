"use server"

import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { getRegion, updateCart } from "@lib/data"

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = cookies().get("_medusa_cart_id")?.value
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  try {
    if (cartId) {
      await updateCart(cartId, { region_id: region.id })
      revalidateTag("cart")
    }

    revalidateTag("regions")
    revalidateTag("products")
  } catch (e) {
    return "Error updating region"
  }

  redirect(`/${countryCode}${currentPath}`)
}
