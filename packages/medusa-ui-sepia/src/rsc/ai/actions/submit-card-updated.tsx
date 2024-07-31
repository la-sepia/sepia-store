"use server";

import { createStreamableUI, getMutableAIState } from "ai/rsc";
import { AI } from "..";
import { ChatBotMessage } from "medusa-ui-sepia/ui";
import { generateId } from "ai";

export async function submitCardUpdated() {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  const message = createStreamableUI(null);

  message.done(<ChatBotMessage>Great buy, do you want me to recommend something else or do you want to finish the purchase?</ChatBotMessage>);

  return {
    message: {
      id: generateId(),
      display: message.value,
    },
  };
}
