## AI-chat-suggest

### This repository is under developing
Implemented functions
- fetch html files with cookie credentials.
- scrape tagged elements.

To be implemented
- Generate messages with ChatGPT API.
- Storing data for each user.

### Overview
Chrome extension to support chat on some dating app.
But considering data privacy policy, I shall not publish URLs or HTML tags required for scraping.
You should customize this system for your purpose.
This system utilizes ChatGPT API and input resources are the user(potential partner)'s profile info and chat logs.
It can be helpful for enjoyable communication when you feel stuck to continue chatting.

### Installation and Tutorial
Customize url and html target tags
```code
cp src/env.sample.ts src/env.ts
```
You can set target tags and define data structure.
Note that you need to edit ```extract~~``` functions in ```utils.ts```

Edit manifest.json
```code
cp public/manifest.sample.json public/manifest.json
```
You should add site urls to ```host_permissions``` that you want to scrape or access.

Then you can build
```code
npm install
npm run build
```

Finally, upload ```dist``` dir to chrome extension dev.

You can click 'fetch profile' and 'fetch conversations' to get the info. The fetched info should be shown in the text area under the buttons.
### Technical Contribution

#### Reach Authentification-Required Pages
We can utilize Chrome browser's cookie and reach the protected pages without authentification on calling fetch API

-> See ```fetchData``` function in ```hooks.ts```

#### DOM Analysis on Chrome Extension
From manifest V3, we can not conduct DOM analysis on ```service_worker.js``` or ```background.js```.
Instead, offscrean is available now. 

-> See ```offscreen.ts``` and ```service_worker.ts```

#### Propagating Data Between popup.js, service_worker.js and offscreen.js
We should effectively use ```runtime.connect``` and ```runtime.sendMessage```

-> See ```usePort``` function in ```hooks.ts```
