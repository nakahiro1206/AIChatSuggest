import React, {useState, useRef, useEffect } from 'react'
import { Commands, Message } from './type';

type LoadingItem = {
    "profile": boolean;
    "conversations": boolean;
    "AIgeneration": boolean;
}

export const usePopup = () => {
    const PROFILE_KEY = 'profileKey';
    const CONVERSATIONS_KEY = 'conversationsKey';

    const [isLoading, setIsLoading] = useState<LoadingItem>({"profile": false,"conversations": false,"AIgeneration":false});
    const setIsLoadingProfile = (b: boolean) => setIsLoading({...isLoading, "profile": b})
    const setIsLoadingConversations = (b: boolean) => setIsLoading({...isLoading, "conversations": b})
    const setIsLoadingAIGeneration = (b: boolean) => setIsLoading({...isLoading, "AIgeneration": b})

    const profileRef = useRef<HTMLTextAreaElement>(null);
    const conversationRef = useRef<HTMLTextAreaElement>(null);

    const port = chrome.runtime.connect({name: "popup-serviceWorker"});
    port.onMessage.addListener((message: Message) => {
        if (message.action == "receiveProfile") {
            console.log(message.content)
            const profile = message.content

            const textarea = profileRef.current;
            if (textarea) {
                textarea.value = profile;
            }

            storeData(PROFILE_KEY, profile)

        } else if (message.action == "receiveConversations") {
            console.log(message.content)
            const conversations = message.content

            const textarea = conversationRef.current;
            if (textarea) {
                textarea.value = conversations;
            }

            storeData(CONVERSATIONS_KEY, conversations)
        }
      })
  
    const getCurrentTabURL = async (): Promise<string | undefined> => {
      return chrome.tabs.query({ active: true, currentWindow: true })
      .then((tabs: chrome.tabs.Tab[]) => {
        const currentURL: string | undefined = tabs[0].url;
        console.log(currentURL);
        return currentURL;
      })
    }

    const getProfileFromMessagePage = async () => {
        const messagePageURL: string|undefined = await getCurrentTabURL();
        if (!messagePageURL) {
            throw new Error("Failed to get current URL!");
        }

        const userIdMatch: RegExpMatchArray | null = messagePageURL.match(/\/messages\/(\d+)/);
        if (!userIdMatch) {
            throw new Error(`no match for ${messagePageURL}`);
        }
            
        const userId: string = userIdMatch[1];

        const baseURL = 'https://with.is/'
        const userPageURL = new URL(`users/${userId}`, baseURL)

        fetchData(userPageURL, "getProfileCall", setIsLoadingProfile)
    }

    const getConversationsFromCurrentURL = async () => {
        const currentURL: string | undefined = await getCurrentTabURL();
    
        if (currentURL === undefined) {
          throw new Error("Failed to get current URL!");
        }
    
        fetchData(new URL(currentURL), "getConversationsCall", setIsLoadingConversations)
      }
  
    // ローカルストレージからデータを読み込む関数
    const loadData = (key: string, textareaRef: React.RefObject<HTMLTextAreaElement>) => {
      // const data = await 
      chrome.storage.local.get(key)
      .then((data: any) => {
        const value = data[key] as string;
        const textarea = textareaRef.current;
        if (value && textarea !== null) {
          textarea.value = value;
        }
      })
    };
  
    const storeData = (key: string, value: string) => {
      // ローカルストレージに保存
      const obj: { [key: string]: string } = {};
      obj[key] = value;
      chrome.storage.local.set(obj);
    }
  
    const fetchData = (resourceURL: URL, callCommand: Commands, setIsloadingItem: (setTo: boolean)=>void) =>{
        setIsloadingItem(true)
      fetch(resourceURL.href, {
        method: 'GET',
        credentials: 'include', // クッキーを含める
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Connection': 'keep-alive',
        },
      })
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text()
      })
      .then((data: string) => {
        const sendMessage: Message = { "action": callCommand, "content": data};
        port.postMessage(sendMessage);
      })
      .catch((reason) => {
        console.error('Error accessing protected resource:', reason);
        alert('Error accessing protected resource:' + reason);
      })
      .finally(() => {
        setIsloadingItem(false)
      })
    }

    useEffect(() => {
        loadData(PROFILE_KEY, profileRef);
        loadData(CONVERSATIONS_KEY, conversationRef);
    }, []);
  
    return {isLoading, setIsLoading, 
      getConversationsFromCurrentURL, getProfileFromMessagePage,
      loadData, storeData, 
      fetchData, 
      profileRef, conversationRef, 
    }
  
  }