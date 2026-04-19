import { toggleMark } from "./inlineMark";

export const toggleItalics = toggleMark({
  nodeName: "Emphasis",
  marker: "*"
});

export const toggleBold = toggleMark({
  nodeName: "StrongEmphasis",
  marker: "**"
});

export const toggleStrikethrough = toggleMark({
  nodeName: "Strikethrough",
  marker: "~~"
})