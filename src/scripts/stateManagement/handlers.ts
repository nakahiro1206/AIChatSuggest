import {MESSAGE_PAGE_URL_PATTERN, formatUserPageURL} from "../../env"
import {getCurrentTabURL} from "../utils"
import {callChatCompletion} from "../callChatCompletion"

export const handlers = (
    setIsLoadingProfile:(b: boolean)=>void,
    setIsLoadingConversations:(b: boolean)=>void,
    setIsLoadingAIGeneration:(b: boolean)=>void,
    fetchData: (resourceURL: URL, callCommand: "getProfileCall" | "getConversationsCall", setIsloadingOfItem: (setTo: boolean) => void) => void,
    AIGenerationRef: React.RefObject<HTMLTextAreaElement>
) => {
  
    const getProfileFromMessagePage = async () => {
      const messagePageURL: string | undefined = await getCurrentTabURL();
      if (!messagePageURL) {
        throw new Error("Failed to get current URL!");
      }
  
      const userIdMatch: RegExpMatchArray | null = messagePageURL.match(
        MESSAGE_PAGE_URL_PATTERN,
      );
      if (!userIdMatch) {
        throw new Error(`no match for ${messagePageURL}`);
      }
  
      const userId: string = userIdMatch[1];
  
      const userPageURL = new URL(formatUserPageURL(userId));
  
      fetchData(userPageURL, "getProfileCall", setIsLoadingProfile);
    };
  
    const getConversationsFromCurrentURL = async () => {
      const currentURL: string | undefined = await getCurrentTabURL();
  
      if (currentURL === undefined) {
        throw new Error("Failed to get current URL!");
      }
  
      fetchData(
        new URL(currentURL),
        "getConversationsCall",
        setIsLoadingConversations,
      );
    };
  
    const generateNextMessage = () => {
      callChatCompletion(setIsLoadingAIGeneration, AIGenerationRef);
    };
  
    return {
      getProfileFromMessagePage,
      getConversationsFromCurrentURL,
      generateNextMessage,
    };
  };