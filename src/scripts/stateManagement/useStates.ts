import { useState, useEffect } from "react";
import {UserInfo } from "../type"
import { MESSAGE_PAGE_URL_PATTERN } from "../../env";
import { loadUserInfo } from "../loadAndStore";
import { getCurrentTabURL } from "../handleURL";

type LoadingItem = {
    profile: boolean;
    conversations: boolean;
    AIgeneration: boolean;
  };

export const useStates = () => {
    const [isLoading, setIsLoading] = useState<LoadingItem>({
      profile: false,
      conversations: false,
      AIgeneration: false,
    });
    const setIsLoadingProfile = (b: boolean) =>
      setIsLoading({ ...isLoading, profile: b });
    const setIsLoadingConversations = (b: boolean) =>
      setIsLoading({ ...isLoading, conversations: b });
    const setIsLoadingAIGeneration = (b: boolean) =>
      setIsLoading({ ...isLoading, AIgeneration: b });
  
    const [userInfo, setUserInfo] = useState<UserInfo>({
      profile: {
        nickname: "", 
        ageAndRegion: "", 
        preference: [], 
        favorite: [], 
        commonality: [],
        introduction: ""
      }, 
      conversations: [], 
      generatedMessage: ""
    });

    const [userId, setUserId] = useState<string | undefined>(undefined)

    useEffect(() => {
      const getUserIdAndLoadDataOnLoad = () => {
        const messagePageURLPromise: Promise<string | undefined> = getCurrentTabURL();
        messagePageURLPromise.then((messagePageURL: string | undefined) => {
          if (!messagePageURL) {
            throw new Error("Failed to get current URL!");
          }

          const userIdMatch: RegExpMatchArray | null = messagePageURL.match(
            MESSAGE_PAGE_URL_PATTERN,
          );
          if (!userIdMatch) {
            throw new Error(`no match for ${messagePageURL}`);
          }
  
          const newUserId: string = userIdMatch[1];
          setUserId(newUserId);
          loadUserInfo(newUserId, setUserInfo);
        })
      }

      getUserIdAndLoadDataOnLoad();
    }, []);
  
    return {
      isLoading,
      setIsLoading,
      setIsLoadingProfile,
      setIsLoadingConversations,
      setIsLoadingAIGeneration,
      userInfo, setUserInfo,
      userId,
    };
  };