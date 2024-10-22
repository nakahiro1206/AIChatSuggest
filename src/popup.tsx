// src/popup.ts
// https://qiita.com/ichitose/items/336bf5adb0fe3a985947

import React from "react";
import { createRoot } from "react-dom/client";

import { Box, BoxProps } from "@mui/material";
import Textarea from "@mui/joy/Textarea";
import Button from "@mui/joy/Button";

import {useStates, usePort, handlers} from './scripts/stateManagement'

import { Item, ProfileComponent } from "./components";

const Popup = () => {
  const {
    isLoading,
    setIsLoadingProfile,
    setIsLoadingConversations,
    setIsLoadingAIGeneration,
    conversationsRef,
    AIGenerationRef,
    userInfo, setUserInfo
  } = useStates();

  const {fetchData} = usePort(userInfo, setUserInfo)

  const {
    getConversationsFromCurrentURL,
    getProfileFromMessagePage,
    generateNextMessage,
  } = handlers(
    setIsLoadingProfile,
    setIsLoadingConversations,
    setIsLoadingAIGeneration,
    fetchData,
    AIGenerationRef,
  );


  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        p: 1,
        m: 1,
        bgcolor: "background.paper",
        borderRadius: 1,
      }}
    >
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
          {/* <Textarea
            minRows={2}
            maxRows={10}
            slotProps={{ textarea: { ref: profileRef } }}
          /> */}
          <ProfileComponent profile={userInfo.profile}/>
        </Box>
      </Item>
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
          <Textarea
            minRows={2}
            maxRows={10}
            slotProps={{ textarea: { ref: conversationsRef } }}
          />
        </Box>
      </Item>
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
          <Textarea
            minRows={2}
            maxRows={10}
            slotProps={{ textarea: { ref: AIGenerationRef } }}
          />
        </Box>
      </Item>
    </Box>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
