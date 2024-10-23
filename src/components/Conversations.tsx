import { Box } from "@mui/material";
import { Grid } from "@mui/joy";
import { ConversationItem } from "../scripts";
import { FC } from "react";
import { Item } from "./Item";
import { styled } from "@mui/material/styles";

type Props = {
  conversations: ConversationItem[];
};

const PartnerMessage = styled("div")`
  text-align: left;
`;

const MyMessage = styled("div")`
  text-align: right;
`;

export const ConversationsComponent: FC<Props> = ({ conversations }) => {
  return (
    <Box sx={{ flexGrow: 1, mx: 2 }}>
      {conversations.map(({ sender, content }: ConversationItem) =>
        sender == "me" ? (
          <MyMessage>{content}</MyMessage>
        ) : (
          <PartnerMessage>{content}</PartnerMessage>
        ),
      )}
    </Box>
  );
};
