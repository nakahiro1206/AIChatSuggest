import { Message } from './type';
import { extractProfile, extractConversations } from './utils';

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
  if (message.action == "getProfile") {
    const res: string = extractProfile(message.content);
    console.log(`offscreen: ${res}`);

    // Send the response
    sendResponse(res);
  } else if (message.action == "getConversations") {
    const res: string = extractConversations(message.content);
    console.log(`offscreen: ${res}`);

    // Send the response
    sendResponse(res);
  }
})