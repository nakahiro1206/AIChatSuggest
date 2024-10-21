import { 
  ConversationItem, 
  Message, 
  Profile,
  extractProfile, 
  extractConversations 
} from "./scripts";

chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    if (message.action == "getProfile") {
      const res: Profile = extractProfile(message.content);
      console.log(`offscreen: ${res}`);

      // Send the response
      sendResponse(res);
    } else if (message.action == "getConversations") {
      const res: ConversationItem[] = extractConversations(message.content);
      console.log(`offscreen: ${res}`);

      // Send the response
      sendResponse(res);
    }
  },
);
