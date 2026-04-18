import { keymap } from "@codemirror/view";
import {  toggleBold } from "./command";
import { indentLess, indentMore } from "@codemirror/commands";

export const keymaps = keymap.of([
    { key: "Tab", run: indentMore },
    { key: "Shift-Tab", run: indentLess },
    { key: "mod-b", run: toggleBold},
    // { key: "mod-i", run: toggleItalics},
]);

