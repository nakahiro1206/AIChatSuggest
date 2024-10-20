export type Commands = "getProfileCall" | 
    "getProfile" | 
    "receiveProfile" | 
    "getConversationsCall" | 
    "getConversations" | 
    "receiveConversations" | 
    "generateMessageCall" | 
    "generateMessage" | 
    "receiveGeneratedMessage";

export type Message = {
    action: Commands;
    content: string;
}