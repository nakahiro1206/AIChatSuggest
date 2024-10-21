import { ConversationItem } from "./type";

export const formatConversations = (
  conversations: ConversationItem[],
): string =>
  conversations.map((msg) => `[${msg.sender}] ${msg.content}`).join("\n");

export const getCurrentTabURL = async (): Promise<string | undefined> => {
  return chrome.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs: chrome.tabs.Tab[]) => {
      const currentURL: string | undefined = tabs[0].url;
      console.log(currentURL);
      return currentURL;
    });
};
