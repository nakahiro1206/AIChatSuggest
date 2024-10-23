import { Message, CallCommands, UserInfo } from "../type";
import { storeUserInfo } from "../loadAndStore";

export const usePort = (
    userInfo: UserInfo, 
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>
) => {
    const USER_INFO_KEY = "userId";

    const port = chrome.runtime.connect({ name: "popup-serviceWorker" });
    port.onMessage.addListener((message: Message) => {
      if (message.action == "receiveProfile") {
        console.log(message.content);
        const profile = message.content;

        const newUserInfo: UserInfo = {...userInfo, "profile": profile}
        
        setUserInfo(newUserInfo)
  
        storeUserInfo(USER_INFO_KEY, newUserInfo);

      } else if (message.action == "receiveConversations") {
        console.log(message.content);
        const conversations = message.content;

        const newUserInfo = {...userInfo, "conversations": conversations}

        setUserInfo(newUserInfo)
  
        storeUserInfo(USER_INFO_KEY, newUserInfo);
      }
    });
  
    const callCommandToExtractDataFromUrl = (
      resourceURL: URL,
      callCommand: CallCommands,
      setIsloadingOfItem: (setTo: boolean) => void,
    ) => {
      setIsloadingOfItem(true);
      fetch(resourceURL.href, {
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
      })
        .then((response: Response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then((data: string) => {
          const sendMessage: Message = {
            action: callCommand,
            content: data,
          };
          port.postMessage(sendMessage);
        })
        .catch((reason) => {
          console.error("Error accessing protected resource:", reason);
          alert("Error accessing protected resource:" + reason);
        })
        .finally(() => {
          setIsloadingOfItem(false);
        });
    };
  
    return {
      callCommandToExtractDataFromUrl,
    };
  };

export const handlers = () => [
    
]