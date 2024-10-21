export type Commands =
  | "getProfileCall"
  | "getProfile"
  | "receiveProfile"
  | "getConversationsCall"
  | "getConversations"
  | "receiveConversations"
  | "generateMessageCall"
  | "generateMessage"
  | "receiveGeneratedMessage";

export type Message =
  | { action: "getProfileCall"; content: string } // raw html -> URL/string/null
  | { action: "getProfile"; content: string } // raw html
  | { action: "receiveProfile"; content: Profile }
  | { action: "getConversationsCall"; content: string } // raw html -> URL/string/null
  | { action: "getConversations"; content: string } // raw html
  | { action: "receiveConversations"; content: ConversationItem[] }
  | { action: "generateMessageCall"; content: string } // raw html
  | { action: "generateMessage"; content: string } // ??
  | { action: "receiveGeneratedMessage"; content: string }; // ??

export type ReceiveConversationsMessage = {
  action: "receiveConversations";
  content: ConversationItem[];
};

export type ConversationItem = {
  sender: "me" | "partner";
  content: string;
};

export const isConversations = (data: any): data is ConversationItem[] => {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      (item.sender === "me" ||
        item.sender === "partner" ||
        item.sender === "unknown") &&
      typeof item.content === "string",
  );
};

export type Profile = {
  nickname: string;
  ageAndRegion: string;
  preference: string;
  commonality: string;
  favorite: FavoriteItem[];
  introduction: string;
};

export type FavoriteItem = {
  title: string;
  description: string;
};

export const isProfile = (data: any): data is Profile => {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.nickname === "string" &&
    typeof data.ageAndRegion === "string" &&
    typeof data.preference === "string" &&
    typeof data.commonality === "string" &&
    typeof data.favorite === "string" &&
    typeof data.introduction === "string"
  );
};
