import { Order } from "@medusajs/medusa";

export function ChatOrderStatus({ order }: { order: Order }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md" data-v0-t="card">
      <div className="flex flex-col space-y-1.5 p-6 bg-muted/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium">Order #{order.display_id}</div>
          <div
            className="inline-flex w-fit items-center whitespace-nowrap rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1 text-xs"
            data-v0-t="badge"
          >
            {order.status}
          </div>
        </div>
      </div>
      <div className="p-6 px-6 py-4">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">Fulfillment Status</div>
            <div
              className="inline-flex w-fit items-center whitespace-nowrap rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground px-3 py-1 text-xs"
              data-v0-t="badge"
            >
              {order.fulfillment_status}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">Payment Status</div>
            <div
              className="inline-flex w-fit items-center whitespace-nowrap rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground px-3 py-1 text-xs"
              data-v0-t="badge"
            >
              {order.payment_status}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
