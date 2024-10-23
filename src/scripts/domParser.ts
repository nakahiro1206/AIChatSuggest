import { QUERY } from "../env";
import { ConversationItem, FavoriteItem, Profile } from "./type";

const getTextContent = (elements: NodeListOf<Element>): string => {
  return Array.from(elements)
    .map((el) => el.textContent?.trim() || "")
    .join(", ");
};

const getTextContentToArray = (elements: NodeListOf<Element>): string[] => {
  return Array.from(elements).map((el) => el.textContent?.trim() || "");
};

const integrateTitleAndDescription = (
  titles: NodeListOf<Element>,
  descriptopns: NodeListOf<Element>,
) => {
  const minLength = Math.min(titles.length, descriptopns.length);
  let res: FavoriteItem[] = [];
  for (let idx = 0; idx < minLength; idx++) {
    const item: FavoriteItem = {
      title: `${titles[idx].textContent?.trim() || ""}`,
      description: `${descriptopns[idx].textContent?.trim() || ""}`,
    };
    res.push(item);
  }
  return res;
};

export const extractProfile = (htmlText: string): Profile => {
  // Parse the HTML string using DOMParser
  const parser = new DOMParser();
  const document = parser.parseFromString(htmlText, "text/html");

  // Extract content using DOMParser
  const nickname = getTextContent(document.querySelectorAll(QUERY.NICKNAME));
  const ageAndRegion = getTextContent(
    document.querySelectorAll(QUERY.AGE_AND_REGION),
  );
  const preference = getTextContentToArray(
    document.querySelectorAll(QUERY.PREFERENCE),
  );
  const commonality = getTextContentToArray(
    document.querySelectorAll(QUERY.COMMONALITY),
  );
  const favorite = integrateTitleAndDescription(
    document.querySelectorAll(QUERY.FAVORITE.TITLE),
    document.querySelectorAll(QUERY.FAVORITE.DESCRIPTION),
  );
  const introduction = getTextContent(
    document.querySelectorAll(QUERY.INTRODUCTION),
  );

  return {
    nickname: nickname,
    ageAndRegion: ageAndRegion,
    preference: preference,
    commonality: commonality,
    introduction: introduction,
    favorite: favorite,
  };
};

export const extractConversations = (htmlText: string): ConversationItem[] => {
  // Parse the HTML string using DOMParser
  const parser = new DOMParser();
  const document = parser.parseFromString(htmlText, "text/html");

  const messages = Array.from(document.querySelectorAll(QUERY.MESSAGES))
    .map((elem: Element) => {
      const sender = elem.getAttribute(QUERY.SENDER_ATTRIBUTE);
      if (sender == "me" || sender == "partner") {
        const text = elem.querySelector("p")?.textContent?.trim() || "";
        // const time = el.querySelector('.message_sent-at')?.textContent?.trim() || '';
        const conversationItem: ConversationItem = {
          sender: sender,
          content: text,
        };
        return conversationItem;
      } else {
        return undefined;
      }
    })
    .filter((elem): elem is ConversationItem => elem !== undefined);

  return messages;
};
