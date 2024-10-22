import { useState, useRef, useEffect } from "react";
import {UserInfo} from "../type"
import { loadData, loadUserInfo } from "../loadAndStore";

type LoadingItem = {
    profile: boolean;
    conversations: boolean;
    AIgeneration: boolean;
  };

  const PROFILE_KEY = "profileKey";
  const CONVERSATIONS_KEY = "conversationsKey";
  const USER_INFO_KEY = "userId"

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
  
    const conversationsRef = useRef<HTMLTextAreaElement>(null);
    const AIGenerationRef = useRef<HTMLTextAreaElement>(null);
  
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
  
    useEffect(() => {
      loadData(CONVERSATIONS_KEY, conversationsRef);
      loadUserInfo(USER_INFO_KEY, setUserInfo);
    }, []);
  
    return {
      isLoading,
      setIsLoading,
      setIsLoadingProfile,
      setIsLoadingConversations,
      setIsLoadingAIGeneration,
      conversationsRef,
      AIGenerationRef,
      userInfo, setUserInfo
    };
  };