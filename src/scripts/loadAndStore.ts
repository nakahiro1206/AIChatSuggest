import {
  Profile,
  isProfile,
  ConversationItem,
  isConversations,
  FavoriteItem,
} from "./type";

// ローカルストレージからデータを読み込む関数
export const loadData = (
  key: string,
  textareaRef: React.RefObject<HTMLTextAreaElement>,
) => {
  // const data = await
  chrome.storage.local.get(key).then((data: any) => {
    const value = data[key] as string;
    const textarea = textareaRef.current;
    if (value && textarea !== null) {
      textarea.value = value;
    }
  });
};

export const loadProfile = (
  key: string,
  setProfile: React.Dispatch<React.SetStateAction<Profile>>,
) => {
  // const data = await
  chrome.storage.local.get(key).then((data: any) => {
    const value: any = data[key];
    if (!isProfile(value)) {
      console.error("invalid data for Profile");
    } else {
      setProfile(value);
    }
  });
};

export const loadConversations = (
  key: string,
  setConversations: React.Dispatch<React.SetStateAction<ConversationItem[]>>,
) => {
  // const data = await
  chrome.storage.local.get(key).then((data: any) => {
    const value: any = data[key];
    if (!isConversations(value)) {
      console.error("invalid data for ConversationItem[]");
    } else {
      setConversations(value);
    }
  });
};

export const storeData = (key: string, value: Profile | ConversationItem[]) => {
  // ローカルストレージに保存
  const obj: { [key: string]: any } = {};
  obj[key] = value;
  chrome.storage.local.set(obj);
};