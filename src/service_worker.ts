import { Message } from "./type";

chrome.runtime.onConnect.addListener((port) => {
    console.assert(port.name === "popup-serviceWorker");
    port.onMessage.addListener((message: Message) => {
        if (message.action == "getProfileCall") {
            const profileText = message.content;
    
            const sendMessage: Message = {"action": "getProfile", "content": profileText};
    
            chrome.offscreen.createDocument({ reasons: [chrome.offscreen.Reason.DOM_SCRAPING], justification: 'parse dom', url: 'offscreen.html' })
            .then(() => {
                chrome.runtime.sendMessage(sendMessage, (title: string) => {
                    chrome.offscreen.closeDocument()
                    console.log(`service worker.ts: ${title}`);
                    
                    const responseMessage: Message = {"action": "receiveProfile", "content": title}
                    port.postMessage(responseMessage)
                })
            });
        } else if (message.action == "getConversationsCall") {
            const conversationsText = message.content;
    
            const sendMessage: Message = {"action": "getConversations", "content": conversationsText};
    
            chrome.offscreen.createDocument({ reasons: [chrome.offscreen.Reason.DOM_SCRAPING], justification: 'parse dom', url: 'offscreen.html' })
            .then(() => {
                chrome.runtime.sendMessage(sendMessage, (conversations: string) => {
                    chrome.offscreen.closeDocument()
                    console.log(`service worker.ts: ${conversations}`);
                    
                    const responseMessage: Message = {"action": "receiveConversations", "content": conversations}
                    port.postMessage(responseMessage)
                })
            });
        }
    })
})