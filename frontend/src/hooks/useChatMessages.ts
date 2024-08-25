// useChatMessages.ts
import { useState, useEffect } from "react";
import { Message } from "ai/react";

type ChatMessage = {
  question: Message;
  answer: Message | null;
};

export const useChatMessages = (messages: Message[]) => {
  const [chatPairs, setChatPairs] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const pairs: ChatMessage[] = [];
    let currentQuestion: Message | null = null;

    messages.forEach((message) => {
      if (message.role === "user") {
        currentQuestion = message;
        pairs.push({ question: message, answer: null });
      } else if (message.role === "assistant" && currentQuestion) {
        const lastPair = pairs[pairs.length - 1];
        lastPair.answer = message;
        currentQuestion = null;
      }
    });

    setChatPairs(pairs);
  }, [messages]);

  return chatPairs;
};
