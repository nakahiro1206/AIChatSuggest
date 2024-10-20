## AI-chat-suggest

### This repository is under developing
Implemented functions
- fetch html files with cookie credentials.
- scrape tagged elements.

To be implemented
- Generate messages with ChatGPT API.
- Storing data for each user.

### Overview
Chrome extension to support chat in [with](https://with.is/), a popular dating app in Japan.
This system utilizes ChatGPT API and input resources are the user(potential partner)'s profile info and chat logs.
It can be helpful for enjoyable communication when you feel stuck to continue chatting.

### Installation and Tutorial
```code
npm install
npm run build
```
Upload ```dist``` dir to chrome extension dev.

Click the extension icon to open a modal on the message page located at https://with.is/messages/:id
You can click 'fetch profile' and 'fetch conversations' to get the info. The fetched info should be shown in the text area under the buttons.
### Technical Contribution

#### Reach Authentification-Required Pages
We can utilize Chrome browser's cookie and reach the protected pages without authentification on calling fetch API

**See hooks.ts**

#### DOM Analysis on Chrome Extension
From manifest V3, we can not conduct DOM analysis on ```service_worker.js``` or ```background.js```.
Instead, offscrean is available now. 

**See offscreen.ts and service_worker.ts**

#### Propagating Data Between popup.js, service_worker.js and offscreen.js
We should effectively use ```runtime.connect``` and ```runtime.sendMessage```

**See hooks.ts**
