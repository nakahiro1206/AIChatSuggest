import { QUERY } from './env';

const getTextContent = (elements: NodeListOf<Element>): string => {
    return Array
    .from(elements)
    .map(el => el.textContent?.trim() || '')
    .join(', ');
}

export const extractProfile = (htmlText: string) => {
    // Parse the HTML string using DOMParser
    const parser = new DOMParser();
    const document = parser.parseFromString(htmlText, 'text/html');

    // Extract content using DOMParser
    const nickname = getTextContent(document.querySelectorAll(QUERY.NICKNAME));
    const ageAndRegion = getTextContent(document.querySelectorAll(QUERY.AGE_AND_REGION));
    const preference = getTextContent(document.querySelectorAll(QUERY.PREFERENCE));
    const commonality = getTextContent(document.querySelectorAll(QUERY.COMMANITY));
    const favorite = {
      title: getTextContent(document.querySelectorAll(QUERY.FAVORITE.TITLE)),
      description: getTextContent(document.querySelectorAll(QUERY.FAVORITE.DESCRIPTION))
    };
    const introduction = getTextContent(document.querySelectorAll(QUERY.INTRODUCTION));
    
    // Output the extracted contents
    const res: string = `\
Nickname: ${nickname}
Age and region: ${ageAndRegion}
Preference: ${preference}
Commonality: ${commonality}
Favorite: ${favorite.title} - ${favorite.description}
Introduction: ${introduction}`;

    return res;
}

export const extractConversations = (htmlText: string) => {
    // Parse the HTML string using DOMParser
    const parser = new DOMParser();
    const document = parser.parseFromString(htmlText, 'text/html');

    const messages = Array.from(document.querySelectorAll(QUERY.MESSAGES))
    .map(elem => {
        const sender = elem.getAttribute(QUERY.SENDER_ATTRIBUTE) || 'unknown';
        const text = elem.querySelector('p')?.textContent?.trim() || '';
        // const time = el.querySelector('.message_sent-at')?.textContent?.trim() || '';
        return { sender, text };
    });

    // Format the messages for output
    const res = messages.map(msg => `[${msg.sender}] ${msg.text}`).join('\n');

    return res;
}

// ローカルストレージからデータを読み込む関数
export const loadData = (key: string, textareaRef: React.RefObject<HTMLTextAreaElement>) => {
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

export const storeData = (key: string, value: string) => {
    // ローカルストレージに保存
    const obj: { [key: string]: string } = {};
    obj[key] = value;
    chrome.storage.local.set(obj);
}

export const getCurrentTabURL = async (): Promise<string | undefined> => {
    return chrome.tabs.query({ active: true, currentWindow: true })
    .then((tabs: chrome.tabs.Tab[]) => {
      const currentURL: string | undefined = tabs[0].url;
      console.log(currentURL);
      return currentURL;
    })
}