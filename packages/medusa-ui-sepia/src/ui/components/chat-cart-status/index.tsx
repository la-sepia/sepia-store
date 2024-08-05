"use client";
import { StoreCartsRes } from "@medusajs/medusa";
import { useRouter } from "next/navigation";

export function ChatCartStatus({ cart }: { cart: StoreCartsRes["cart"] }) {
  const router = useRouter();

  const subtotal = (cart.subtotal ?? 0) / 100;
  const total = (cart.total ?? 0) / 100;

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md" data-v0-t="card">
      <div className="flex flex-col space-y-1.5 p-6 bg-muted/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium">Your cart</div>
        </div>
      </div>
      <div className="p-6 px-6 py-4">
        <div className="grid gap-4 txt-medium">
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">Total products</div>
            <div className="inline-flex w-fit items-center whitespace-nowrap text-foreground px-3 py-1">{cart.items.length}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">Subtotal (excl. taxes)</div>
            <div className="inline-flex w-fit items-center whitespace-nowrap text-foreground px-3 py-1">{subtotal.toFixed(2)}$</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">Total (with. taxes and shipping)</div>
            <div className="inline-flex w-fit items-center whitespace-nowrap text-foreground px-3 py-1">{total.toFixed(2)}$</div>
          </div>
          <button
            onClick={() => router.push("/us/checkout?step=address")}
            className="transition-fg relative inline-flex items-center justify-center overflow-hidden rounded-md outline-none disabled:bg-ui-bg-disabled disabled:border-ui-border-base disabled:text-ui-fg-disabled disabled:shadow-buttons-neutral disabled:after:hidden after:transition-fg after:absolute after:inset-0 after:content-[''] shadow-buttons-inverted text-ui-fg-on-inverted bg-ui-button-inverted after:button-inverted-gradient hover:bg-ui-button-inverted-hover hover:after:button-inverted-hover-gradient active:bg-ui-button-inverted-pressed active:after:button-inverted-pressed-gradient focus-visible:!shadow-buttons-inverted-focus txt-compact-small-plus gap-x-1.5 px-3 py-1.5 w-full h-10"
          >
            Go to checkout
          </button>
        </div>
      </div>
    </div>
  );
}
