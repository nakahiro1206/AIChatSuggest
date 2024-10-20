import { extractConversations, extractProfile } from "./utils";
import fs from 'fs';

const str = fs.readFileSync("html/conversation.html", "utf8")
const res = extractConversations(str);
console.log(res);
