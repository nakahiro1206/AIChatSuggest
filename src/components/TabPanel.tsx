import { Box } from "@mui/joy";
import { FC } from "react";

export const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

type TabPanelProps = {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export const TabPanel:FC<TabPanelProps> = ({children, value, index, ...other}) => {

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        style={{
            "width": "100%"
        }}
        {...other}
        >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}