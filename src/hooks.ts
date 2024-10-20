import {useState, useRef, useEffect } from 'react'
import { Commands, Message } from './type';
import { loadData, storeData, getCurrentTabURL } from './utils';
import { formatUserPageURL, MESSAGE_PAGE_URL_PATTERN } from './env';

type LoadingItem = {
    "profile": boolean;
    "conversations": boolean;
    "AIgeneration": boolean;
}

const useHooks = () => {
    const [isLoading, setIsLoading] = useState<LoadingItem>({"profile": false,"conversations": false,"AIgeneration":false});
    const setIsLoadingProfile = (b: boolean) => setIsLoading({...isLoading, "profile": b})
    const setIsLoadingConversations = (b: boolean) => setIsLoading({...isLoading, "conversations": b})
    const setIsLoadingAIGeneration = (b: boolean) => setIsLoading({...isLoading, "AIgeneration": b})

    const profileRef = useRef<HTMLTextAreaElement>(null);
    const conversationsRef = useRef<HTMLTextAreaElement>(null);

    return {
        isLoading, setIsLoading, 
        setIsLoadingProfile, setIsLoadingConversations, setIsLoadingAIGeneration, 
        profileRef, conversationsRef
    }
}

const usePort = () => {
    const {
        isLoading, setIsLoading, 
        setIsLoadingProfile, setIsLoadingConversations, setIsLoadingAIGeneration, 
        profileRef, conversationsRef
    } = useHooks();

    const PROFILE_KEY = 'profileKey';
    const CONVERSATIONS_KEY = 'conversationsKey';

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

            const textarea = conversationsRef.current;
            if (textarea) {
                textarea.value = conversations;
            }

            storeData(CONVERSATIONS_KEY, conversations)
        }
    })
  
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
  
    return {
        isLoading, setIsLoading, 
        setIsLoadingProfile, setIsLoadingConversations, setIsLoadingAIGeneration, 
        profileRef, conversationsRef, 
        fetchData, PROFILE_KEY, CONVERSATIONS_KEY
    }
}

export const usePopup = () => {
    const {
        isLoading, setIsLoading, 
        setIsLoadingProfile, setIsLoadingConversations, setIsLoadingAIGeneration, 
        profileRef, conversationsRef, 
        fetchData, PROFILE_KEY, CONVERSATIONS_KEY
    } = usePort()

    const getProfileFromMessagePage = async () => {
        const messagePageURL: string|undefined = await getCurrentTabURL();
        if (!messagePageURL) {
            throw new Error("Failed to get current URL!");
        }

        const userIdMatch: RegExpMatchArray | null = messagePageURL.match(MESSAGE_PAGE_URL_PATTERN);
        if (!userIdMatch) {
            throw new Error(`no match for ${messagePageURL}`);
        }
            
        const userId: string = userIdMatch[1];

        const userPageURL = new URL(formatUserPageURL(userId))

        fetchData(userPageURL, "getProfileCall", setIsLoadingProfile)
    }

    const getConversationsFromCurrentURL = async () => {
        const currentURL: string | undefined = await getCurrentTabURL();
    
        if (currentURL === undefined) {
          throw new Error("Failed to get current URL!");
        }
    
        fetchData(new URL(currentURL), "getConversationsCall", setIsLoadingConversations)
    }

    useEffect(() => {
        loadData(PROFILE_KEY, profileRef);
        loadData(CONVERSATIONS_KEY, conversationsRef);
    }, []);
  
    return {
        isLoading, setIsLoading, 
        setIsLoadingProfile, setIsLoadingConversations, setIsLoadingAIGeneration, 
        profileRef, conversationsRef, 
        getProfileFromMessagePage, getConversationsFromCurrentURL
    }
}