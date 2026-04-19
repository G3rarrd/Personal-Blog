import { keymap } from "@codemirror/view";
import { indentLess, indentMore } from "@codemirror/commands";
// import { toggleBold, } from "../commands/bold";
import { toggleItalics, toggleBold, toggleStrikethrough } from "../commands/markCommands";

export const keymaps = keymap.of([
    { key: "Tab", run: indentMore },
    { key: "Shift-Tab", run: indentLess },
    { key: "mod-b", run: toggleBold},
    { key: "mod-i", run: toggleItalics},
    { key: "Mod-Shift-s", run: toggleStrikethrough },
]);

