"use server";

import { createAI } from "ai/rsc";
import { CoreMessage, generateId } from "ai";

import { submitUserMessage } from "./actions/submit-user-message";

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
};

export const AI = createAI<AIState, UIState, UIActions>({
  actions: {
    submitUserMessage,
  },
  initialAIState: { chatId: generateId(), messages: [] },
  initialUIState: [],
});
