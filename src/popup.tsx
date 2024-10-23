// src/popup.ts
// https://qiita.com/ichitose/items/336bf5adb0fe3a985947

import React from "react";
import { createRoot } from "react-dom/client";

import { Box, Tab, Tabs } from "@mui/material";
import Button from "@mui/joy/Button";

import {useStates, usePort, 
  profileOnClickHandler, 
  conversationsOnClickHandler,
  AIGenerationOnClickHandler
} from './scripts/stateManagement'

import { 
  Item, ProfileComponent, ConversationsComponent, AIGeneration,
  TabPanel, a11yProps
 } from "./components";

const Popup = () => {
  const {
    isLoading,
    setIsLoadingProfile,
    setIsLoadingConversations,
    setIsLoadingAIGeneration,
    userInfo, setUserInfo
  } = useStates();

  const {callCommandToExtractDataFromUrl} = usePort(userInfo, setUserInfo)

  const {
    getProfileFromMessagePage
  } = profileOnClickHandler(
    setIsLoadingProfile, 
    callCommandToExtractDataFromUrl
  )

  const {
    getConversationsFromCurrentURL
  } = conversationsOnClickHandler(
    setIsLoadingConversations, 
    callCommandToExtractDataFromUrl
  )

  const {
    generateNextMessage,
  } = AIGenerationOnClickHandler(
    setIsLoadingAIGeneration,
    userInfo, 
    setUserInfo
  );


  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  return (
    <Box
      sx={{
        p: 1,
        m: 1,
        bgcolor: "background.paper",
        borderRadius: 1,
        width: 800,
        height: 800
      }}
    >
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        width: "100%" 
        }}
      >
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Profile" {...a11yProps(0)} />
          <Tab label="Conversations" {...a11yProps(1)} />
          <Tab label="AI generation" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Item>
          <Box sx={{ p: 1 }}>
            <Button
              onClick={getProfileFromMessagePage}
              loading={isLoading.profile}
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              Fetch profile
            </Button>
          </Box>
          <Box sx={{ p: 1 }}>
            <ProfileComponent profile={userInfo.profile}/>
          </Box>
        </Item>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <Item>
        <Box sx={{ p: 1 }}>
          <Button
            onClick={getConversationsFromCurrentURL}
            loading={isLoading.conversations}
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            Fetch Conversations
          </Button>
        </Box>
        <Box sx={{ p: 1 }}>
          <ConversationsComponent conversations={userInfo.conversations}/>
        </Box>
      </Item>
      </TabPanel>
      <TabPanel value={value} index={2}>
      <Item>
        <Box sx={{ p: 1 }}>
          <Button
            sx={{
              whiteSpace: "nowrap",
            }}
            onClick={generateNextMessage}
            loading={isLoading.AIgeneration}
          >
            AI generation
          </Button>
        </Box>
        <Box sx={{ p: 1 }}>
          <AIGeneration generatedMessage={userInfo.generatedMessage} />
        </Box>
      </Item>
      </TabPanel>
    </Box>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
