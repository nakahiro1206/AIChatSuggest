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

export type CallCommands = "getProfileCall" | "getConversationsCall";

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
  preference: string[];
  commonality: string[];
  favorite: FavoriteItem[];
  introduction: string;
};

export type FavoriteItem = {
  title: string;
  description: string;
};

export const isFavoriteItems = (data: any): data is FavoriteItem[] => {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof item.title === "string" &&
      typeof item.description === "string",
  );
};

export const isStringArray = (data: any): data is string[] => {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every((item) => typeof item === "string");
};

export const isProfile = (data: any): data is Profile => {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.nickname === "string" &&
    typeof data.ageAndRegion === "string" &&
    isStringArray(data.preference) &&
    isStringArray(data.commonality) &&
    isFavoriteItems(data.favorite) &&
    typeof data.introduction === "string"
  );
};

export type UserInfo = {
  profile: Profile;
  conversations: ConversationItem[];
  generatedMessage: string;
};

export const isUserInfo = (data: any): data is UserInfo => {
  return (
    typeof data === "object" &&
    data !== null &&
    isProfile(data.profile) &&
    isConversations(data.conversations) &&
    typeof data.generatedMessage === "string"
  );
};

export type ChatCompletionMessageParam = {
  "role": "system" | "user" | "assistant";
  "content": string;
}

export const stringifyUserInfo = (userInfo: UserInfo): ChatCompletionMessageParam[] => {
  const {profile, conversations} = userInfo;
  const messages: ChatCompletionMessageParam[] = [];

  const {nickname, ageAndRegion, introduction, preference, favorite, commonality} = profile;
  const stringifiedProfile: string = `Name: ${nickname}, age and region: ${ageAndRegion}, introduction: ${introduction}` + 
  `favorite: [${favorite.map(({title, description})=>`[${title}: ${description}]`).join()}]` + 
  `preference: [${preference.map((item)=>`${item}`).join()}]`
  
  messages.push({
    "role": "system",
    "content": `Please simulate the next message based on user's profile and the conversation history. The user's profile is ${stringifiedProfile}`
  })

  conversations.map(({sender, content}) => {
    const item: ChatCompletionMessageParam = {
      "role": (sender == "me")? "assistant": "user",
      "content": content
    }
    messages.push(item);
  })

  return messages;
}