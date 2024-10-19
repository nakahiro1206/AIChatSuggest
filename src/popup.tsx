// src/popup.ts
import React, {useState, useRef, useEffect} from 'react'
import { createRoot } from "react-dom/client";
import {scrapeProfile} from './scrapeProfile';

import { Box, TextareaAutosize, Button } from '@mui/material';

const usePopup = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const profileRef = useRef<HTMLTextAreaElement>(null);
  const conversationRef = useRef<HTMLTextAreaElement>(null);

  const getCurrentTabURL = async (): Promise<string | undefined> => {
    const tabs: chrome.tabs.Tab[] = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentURL: string | undefined = tabs[0].url;
    console.log(currentURL);

    return currentURL;
  }

  // ローカルストレージからデータを読み込む関数
  const loadData = async (key: string, textareaRef: React.RefObject<HTMLTextAreaElement>) => {
    const data = await chrome.storage.local.get(key);
    const value = data[key] as string;

    const textarea = textareaRef.current;
    if (value && textarea !== null) {
      const scrapedProfile = scrapeProfile(value);
      textarea.value = scrapedProfile;
    }
  };

  const storeData = async (key: string, value: string) => {
    // ローカルストレージに保存
    const obj: { [key: string]: string } = {};
    obj[key] = value;
    await chrome.storage.local.set(obj);
    alert('データを取得して保存しました。');
  }

  const fetchData = async (resourceURL: URL, textareaRef: React.RefObject<HTMLTextAreaElement>): Promise<string | null> =>{
    let fetchedData: string | null = null;

    setIsLoading(true);
    try {
      const response = await fetch(resourceURL.href, {
        method: 'GET',
        credentials: 'include', // クッキーを含める
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Connection': 'keep-alive',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: string = await response.text();
      fetchedData = data;

      console.log('Protected resource data:', data);
      
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.value = data;
      }
    } catch (error) {
      console.error('Error accessing protected resource:', error);
      alert('Error accessing protected resource:' + error);
    } finally {
      setIsLoading(false);
    }

    return fetchedData;
  }

  return {isLoading, setIsLoading, 
    getCurrentTabURL, 
    loadData, storeData, 
    fetchData, 
    profileRef, conversationRef, 
  }

}

const Popup = () => {
  const MY_DATA_KEY = 'myDataID';

  const {isLoading, setIsLoading, 
    getCurrentTabURL, 
    loadData, storeData, 
    fetchData, 
    profileRef, conversationRef, 
  } = usePopup();

  useEffect(() => { async () => 
    await loadData('myDataID', profileRef);
  }, []);

  // 初期データの読み込み
  

  // 指定のサイトからデータをfetchしてローカルストレージに保存する関数
  // const fetchData = async () => {

  

  const fetchDataFromCurrentURL = async () => {
    const currentURL: string | undefined = await getCurrentTabURL();

    if (currentURL === undefined) {
      throw new Error("Failed to get current URL!");
    }

    const fetchedData: string | null = await fetchData(new URL(currentURL), profileRef)
    if (fetchedData) {
      await storeData('myDataID', fetchedData)
    }
  }

 return(
  <Box width={500} height={600}>
    <Box>
      <TextareaAutosize 
      ref={profileRef}
      placeholder='Fetched profile'/>
      <Button
      onClick={fetchDataFromCurrentURL}
      disabled={isLoading}
      >Fetch profile</Button>
    </Box>
    <Box>
      <TextareaAutosize 
      ref={conversationRef}/>
      <Button
      onClick={()=>{}}
      disabled={isLoading}
      >Fetch Conversations</Button>
    </Box>
  </Box>
 )

}

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
