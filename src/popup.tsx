// src/popup.ts
// https://qiita.com/ichitose/items/336bf5adb0fe3a985947

import React from 'react'
import { createRoot } from "react-dom/client";

import { Box, BoxProps } from '@mui/material';
import Textarea from '@mui/joy/Textarea';
import Button from '@mui/joy/Button';


import { usePopup } from './hooks';

function Item(props: BoxProps) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={[
        (theme) => ({
          p: 1,
          m: 1,
          bgcolor: 'grey.100',
          color: 'grey.800',
          border: '1px solid',
          borderColor: 'grey.300',
          borderRadius: 2,
          fontSize: '0.875rem',
          fontWeight: '700',
          ...theme.applyStyles('dark', {
            bgcolor: '#101010',
            color: 'grey.300',
            borderColor: 'grey.800',
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    />
  );
}

const Popup = () => {

  const {
    isLoading,
    getConversationsFromCurrentURL, getProfileFromMessagePage,
    profileRef, conversationRef,  
  } = usePopup();

 return(
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      p: 1,
      m: 1,
      bgcolor: 'background.paper',
      borderRadius: 1,
    }}
  >
    <Item>
      <Box sx={{ p: 1 }}>
      <Button
        onClick={getProfileFromMessagePage}
        loading={isLoading.profile}
        sx={{
          whiteSpace: 'nowrap'
        }}
        >
        Fetch profile
      </Button>
      </Box>
      <Box sx={{ p: 1 }}>
      <Textarea
      minRows={2}
      maxRows={10}
      slotProps={{ textarea: { ref: profileRef } }}
      />
      </Box>
    </Item>
    <Item>
      <Box sx={{ p: 1 }}>
        <Button
        onClick={getConversationsFromCurrentURL}
        loading={isLoading.conversations}
        sx={{
          whiteSpace: 'nowrap'
        }}
        >
          Fetch Conversations
        </Button>
      </Box>
      <Box sx={{ p: 1 }}>
        <Textarea
        minRows={2} 
        maxRows={10}
        slotProps={{ textarea: { ref: conversationRef } }}
        />
      </Box>
    </Item>
    <Item>
      <Box sx={{ p: 1 }}>
        <Button
        sx={{
          whiteSpace: 'nowrap'
        }}
        loading={isLoading.AIgeneration}
        >
          AI generation
        </Button>
      </Box>
      <Box sx={{ p: 1 }}>
        <Textarea minRows={2} maxRows={10}/>
      </Box>
    </Item>
  </Box>
 )

}

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
