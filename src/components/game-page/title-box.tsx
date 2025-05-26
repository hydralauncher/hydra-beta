import { Box } from "./box";
import { Typography } from "../common";

export function TitleBox({ title }: { title: string }) {
  return (
    <Box>
      <Typography
        style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.5)" }}
      >
        {title}
      </Typography>
    </Box>
  );
}
