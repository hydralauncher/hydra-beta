import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming";

addons.setConfig({
  theme: create({
    base: "dark",
    fontBase: '"Inter", sans-serif',
    fontCode: "monospace",
    brandTitle: "Dark Matter UI",
    brandUrl: "https://storybook.hydralauncher.gg/",
    brandImage: "/storybook-logo.svg",
    brandTarget: "_self",
    colorPrimary: "#ffffff",
    colorSecondary: "#83838350",
    appBg: "#141414",
    appContentBg: "#141414",
    appPreviewBg: "#141414",
    appBorderColor: "#8383831a",
    appBorderRadius: 2,
    textColor: "#ffffff",
    textInverseColor: "#ffffff",
    barTextColor: "#838383",
    barSelectedColor: "#cecece",
    barHoverColor: "#cecece",
    barBg: "#141414",
    inputBg: "#222425",
    inputBorder: "#ffffff1a",
    inputTextColor: "#ffffff",
    inputBorderRadius: 4,
  }),
});
