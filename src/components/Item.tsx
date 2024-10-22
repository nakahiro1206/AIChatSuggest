import { Box, BoxProps } from "@mui/material";

export const Item = (props: BoxProps) => {
    const { sx, ...other } = props;
    return (
      <Box
        sx={[
          (theme) => ({
            p: 1,
            m: 1,
            bgcolor: "grey.100",
            color: "grey.800",
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 2,
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
  }