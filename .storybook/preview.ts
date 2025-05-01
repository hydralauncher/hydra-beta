import type { Preview } from "@storybook/react";
import { themes } from "@storybook/theming";
import "@/styles/globals.scss";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "light", value: "#F0F0F0" },
        { name: "dark", value: "#1E1E1E" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: themes.dark,
    },
  },
};

export default preview;
