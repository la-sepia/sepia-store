import { UIState } from "medusa-ui-sepia/rsc";

export interface ChatList {
  messages?: UIState;
}

const EmptyScreen = () => (
  <div className="mx-auto max-w-2xl px-4">
    <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
      <h1 className="text-md font-semibold">Welcome to SEPIA, your AI-powered personal shopper</h1>
      <p className="leading-normal text-sm text-muted-foreground">This is a plugin for MedusaJS, an open-source e-commerce framework.</p>
      <p className="leading-normal text-sm text-muted-foreground">This is a proof of concept (PoC) for integrating AI into any MedusaJS shop. You can perform the following actions:</p>
      <ul className="text-sm text-muted-foreground list-decimal pl-4">
        <li>Ask for an item of clothing</li>
        <li>Ask about the cart status</li>
        <li>
          Ask about an order status. You can use <pre>john@example.com</pre> as the email and orders 1, 2, or 3, or any order you add.
        </li>
      </ul>
    </div>
  </div>
);
export const ChatList = ({ messages }: ChatList) => {
  const messagesReversed = [...(messages ?? [])].reverse();

  return (
    <div
      className="pr-4 h-[474px] overflow-y-auto flex flex-col-reverse justify-start gap-y-4"
      style={{
        minWidth: "100%",
        maxHeight: "500px",
      }}
    >
      {messagesReversed.length === 0 && <EmptyScreen />}
      {messagesReversed.map((message) => (
        <div key={message.id}>{message.display}</div>
      ))}
    </div>
  );
};
