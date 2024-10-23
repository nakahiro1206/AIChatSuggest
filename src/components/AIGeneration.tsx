import { FC } from "react";
import { Box } from "@mui/joy";

type Props = {
  generatedMessage: string;
};

export const AIGeneration: FC<Props> = ({ generatedMessage }) => {
  return <Box>{generatedMessage}</Box>;
};
