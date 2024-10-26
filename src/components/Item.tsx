import { Box, BoxProps } from "@mui/material";

export const Item = (props: BoxProps) => {
  const { sx, ...other } = props;
  return (
    <Box
      sx={[
        (theme) => ({
          p: 1,
          fontSize: "0.875rem",
          fontWeight: "700",
          ...theme.applyStyles("dark", {
            bgcolor: "#101010",
            color: "grey.300",
            borderColor: "grey.800",
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    />
  );
};
