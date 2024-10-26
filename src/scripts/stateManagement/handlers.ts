import {formatUserPageURL, OPENAI_API_KEY} from "../../env"
import {getCurrentTabURL} from "../handleURL"
import { storeUserInfo } from "../loadAndStore";
import { CallCommands, UserInfo, stringifyUserInfo } from "../type";

export const profileOnClickHandler = (
  setIsLoadingProfile:(b: boolean)=>void,
  callCommandToExtractDataFromUrl: (resourceURL: URL, callCommand: CallCommands, setIsloadingOfItem: (setTo: boolean) => void) => void,
  userId: string | undefined
) => {

  const getProfileFromMessagePage = async () => {
    if (!userId) {
      throw new Error("getProfileFromMessagePage: userId is undefined!");
    }

    const userPageURL = new URL(formatUserPageURL(userId));

    callCommandToExtractDataFromUrl(
      userPageURL, 
      "getProfileCall", 
      setIsLoadingProfile
    );
  };

  return {
    getProfileFromMessagePage
  };
};

export const conversationsOnClickHandler = (
  setIsLoadingConversations:(b: boolean)=>void,
  callCommandToExtractDataFromUrl: (resourceURL: URL, callCommand: CallCommands, setIsloadingOfItem: (setTo: boolean) => void) => void,
) => {

  const getConversationsFromCurrentURL = async () => {
    const currentURL: string | undefined = await getCurrentTabURL();

    if (currentURL === undefined) {
      throw new Error("Failed to get current URL!");
    }

    callCommandToExtractDataFromUrl(
      new URL(currentURL),
      "getConversationsCall",
      setIsLoadingConversations,
    );
  };

  return {
    getConversationsFromCurrentURL,
  };
};

export const AIGenerationOnClickHandler = (
    setIsLoadingAIGeneration:(b: boolean)=>void,
    userInfo: UserInfo,
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>,
    userId: string | undefined
) => {  
    const generateNextMessage = async () => {
      setIsLoadingAIGeneration(true);
      setUserInfo((userInfo: UserInfo) => {
        return {
          ...userInfo, "generatedMessage": ""
        }
      })

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + OPENAI_API_KEY,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: stringifyUserInfo(userInfo),
          stream: true,
        }),
      });

      if (!response.body) throw new Error("ReadableStream not supported");

      const reader = response.body.getReader();

      const decoder = new TextDecoder();
      const loopRunner = true;
      let generatedMessage: string = "";

      while (loopRunner) {
        // Here we start reading the stream, until its done.
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        const decodedChunk = decoder.decode(value, { stream: true });
        // The streamed data may contain multiple JSON objects, separated by newlines.
        const lines = decodedChunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          // Each line may begin with "data: ", we need to remove that prefix.
          if (line.startsWith("data: ")) {
            const jsonData = line.replace("data: ", "");

            // Ignore "[DONE]" message.
            if (jsonData === "[DONE]") {
              break;
            }

            try {
              // Parse the JSON data.
              const parsedData = JSON.parse(jsonData);
              const content = parsedData.choices[0]?.delta?.content;

              // If there is new content, append it to the textarea.
              if (content) {
                generatedMessage += content;
                setUserInfo((userInfo: UserInfo) => {
                  return {
                    ...userInfo, "generatedMessage": generatedMessage
                  }
                })
              }
            } catch (error) {
              console.error("Failed to parse streamed data:", error);
            }
          }
        }
      }
      storeUserInfo(userId, {...userInfo, "generatedMessage": generatedMessage})
      setIsLoadingAIGeneration(false);
    };
  
    return {
      generateNextMessage,
    };
  };