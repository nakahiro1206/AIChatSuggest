import { Box } from "@mui/material";
import { ConversationItem } from "../scripts";
import { FC } from "react";
import { styled } from "@mui/material/styles";

type Props = {
  conversations: ConversationItem[];
};

const PartnerMessage = styled("div")`
  position: relative;
  float: left;

  background-color: #f1f1f1;

  width: auto;
  max-width: 68%;
  border-radius: 24px;
  padding: 10px;
  font-size: 14px;
  margin-bottom: 15px;
`;

const MyMessage = styled("div")`
  position: relative;
  float: right;

  color: #fff;
  background-color: #fe6970;
  opacity: 0.9;

  width: auto;
  max-width: 68%;
  border-radius: 24px;
  padding: 10px;
  font-size: 14px;
  margin-bottom: 15px;
`;

export const ConversationsComponent: FC<Props> = ({ conversations }) => {
  return (
    <Box sx={{
      flexGrow: 1, 
      mx: 2 }}>
      {conversations.map(({ sender, content }: ConversationItem, index: number) =>
        sender == "me" ? (
          <MyMessage key={index}>{content}</MyMessage>
        ) : (
          <PartnerMessage key={index}>{content}</PartnerMessage>
        ),
      )}
    </Box>
  );
};
