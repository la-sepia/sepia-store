"use server";

import { createAI } from "ai/rsc";
import { CoreMessage, generateId } from "ai";

import { submitUserMessage } from "./actions/submit-user-message";
import { submitCardUpdated } from "./actions/submit-card-updated";

export type Message = CoreMessage & {
  id: string;
};

export type AIState = {
  chatId: string;
  messages: Message[];
};

export type UIState = {
  id: string;
  display: React.ReactNode;
}[];

export type UIActions = {
  submitUserMessage: typeof submitUserMessage;
  submitCardUpdated: typeof submitCardUpdated;
};

export const AI = createAI<AIState, UIState, UIActions>({
  actions: {
    submitUserMessage,
    submitCardUpdated,
  },
  initialAIState: { chatId: generateId(), messages: [] },
  initialUIState: [],
});
