import { UIState } from "medusa-ui-sepia/rsc";

export interface ChatList {
  messages: UIState;
}

export const ChatList = ({ messages }: ChatList) => {
  return (
    <div
      className="pr-4 h-[474px] overflow-y-auto flex flex-col-reverse justify-start gap-y-4"
      style={{
        minWidth: "100%",
        maxHeight: "500px",
      }}
    >
      {messages.toReversed().map((message) => (
        <div key={message.id}>{message.display}</div>
      ))}
    </div>
  );
};
