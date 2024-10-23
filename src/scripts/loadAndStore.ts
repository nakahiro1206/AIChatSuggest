import {
  UserInfo,
  isUserInfo,
} from "./type";

// ローカルストレージからデータを読み込む関数
export const loadUserInfo = (
  userId: string | undefined,
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>,
) => {
  if (userId === undefined) {
    console.error("loadUserInfo: userId is undefined!")
    return;
  }

  chrome.storage.local.get(userId).then((data: any) => {
    const value: any = data[userId];
    console.log(value)
    if (!isUserInfo(value)) {
      console.error("invalid data for ConversationItem[]");
    } else {
      setUserInfo(value);
    }
  });
};

export const storeUserInfo = (userId: string | undefined, value: UserInfo) => {
  if (userId === undefined) {
    throw new Error("storeUserInfo: userId is undefined!");
  }
  // ローカルストレージに保存
  const obj: { [userId: string]: any } = {};
  obj[userId] = value;
  chrome.storage.local.set(obj);
};
