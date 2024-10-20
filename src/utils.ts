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
    const nickname = getTextContent(document.querySelectorAll('.profile_main-nickname'));
    const ageAndRegion = getTextContent(document.querySelectorAll('.profile_main-age-address'));
    /**好みカード */
    const preference = getTextContent(document.querySelectorAll('.group-card_title'));
    /**共通点 */
    const commonality = getTextContent(document.querySelectorAll('.profile-affinity'));
    /**好みベスト */
    const favorite = {
      title: getTextContent(document.querySelectorAll('.konomi-comment_name')),
      description: getTextContent(document.querySelectorAll('.konomi-comment_text'))
    };
    /**自己紹介 */ 
    const introduction = getTextContent(document.querySelectorAll('.profile-introduction_content'));
    
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

    const messages = Array.from(document.querySelectorAll('.message_balloon.has-message'))
    .map(el => {
        const sender = el.getAttribute('data-sender') || 'unknown';
        const text = el.querySelector('p')?.textContent?.trim() || '';
        // const time = el.querySelector('.message_sent-at')?.textContent?.trim() || '';
        return { sender, text };
    });

    // Format the messages for output
    const res = messages.map(msg => `[${msg.sender}] ${msg.text}`).join('\n');

    return res;
}