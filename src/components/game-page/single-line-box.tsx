import { Typography } from "../common";
import { Box } from "./box";

export interface SingleLineBoxProps {
  title: string;
  value: string;
}

export function SingleLineBox({ title, value }: SingleLineBoxProps) {
  return (
    <Box style={{ display: "flex", justifyContent: "space-between" }}>
      <Typography style={{ color: "rgba(255, 255, 255, 0.5)" }}>
        {title}
      </Typography>
      <Typography style={{ fontWeight: "700" }}>{value}</Typography>
    </Box>
  );
}
