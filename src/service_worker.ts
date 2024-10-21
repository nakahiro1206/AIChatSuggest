import { ConversationItem, Message, ReceiveConversationsMessage, Profile } from "./scripts";

chrome.runtime.onConnect.addListener((port) => {
  console.assert(port.name === "popup-serviceWorker");
  port.onMessage.addListener((message: Message) => {
    if (message.action == "getProfileCall") {
      const profileText = message.content;

      fetch("https://chatgpt.com/", {
        method: "GET",
        credentials: "include", // クッキーを含める
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          Connection: "keep-alive",
        },
      }).then((response: Response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(response.text());

        const sendMessage: Message = {
          action: "getProfile",
          content: profileText,
        };

        chrome.offscreen
          .createDocument({
            reasons: [chrome.offscreen.Reason.DOM_SCRAPING],
            justification: "parse dom",
            url: "offscreen.html",
          })
          .then(() => {
            chrome.runtime.sendMessage(sendMessage, (profile: Profile) => {
              chrome.offscreen.closeDocument();

              const responseMessage: Message = {
                action: "receiveProfile",
                content: profile,
              };
              port.postMessage(responseMessage);
            });
          });
      });
    } else if (message.action == "getConversationsCall") {
      const conversationsText = message.content;

      const sendMessage: Message = {
        action: "getConversations",
        content: conversationsText,
      };

      chrome.offscreen
        .createDocument({
          reasons: [chrome.offscreen.Reason.DOM_SCRAPING],
          justification: "parse dom",
          url: "offscreen.html",
        })
        .then(() => {
          chrome.runtime.sendMessage(
            sendMessage,
            (conversations: ConversationItem[]) => {
              chrome.offscreen.closeDocument();
              console.log(`service worker.ts: ${conversations}`);

              const responseMessage: ReceiveConversationsMessage = {
                action: "receiveConversations",
                content: conversations,
              };
              port.postMessage(responseMessage);
            },
          );
        });
    }
  });
});
