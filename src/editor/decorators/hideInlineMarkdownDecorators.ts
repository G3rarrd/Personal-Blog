import { EditorState } from "@codemirror/state";
import { Decoration, EditorView } from "@codemirror/view";
import { SyntaxNodeRef } from "@lezer/common";
import { DecorationRange } from "../types/DecorationRange";

function hideMarkers(from: number, to: number, length: number, ranges: any[]) {
    ranges.push({ from: from, to: from + length, decoration: Decoration.replace({}) });
    ranges.push({ from: to - length, to: to, decoration: Decoration.replace({}) });
}

const MARKER_LENGTHS: Record<string, number> = {
    StrongEmphasis: 2,
    Emphasis: 1,
    Strikethrough: 2,
    InlineCode : 1
};

export const inlineNodes = new Set([
    "StrongEmphasis",
    "Emphasis",
    "InlineCode",
    "Strikethrough"
])

export const hideInlineMarkdownsDecorator = (
    view : EditorView, 
    node : SyntaxNodeRef, 
    ranges : DecorationRange[]
):void => {
    const name : string =node.name 

    if (!inlineNodes.has(name)) return;

    const {from, to} = node;

    const state : EditorState = view.state;
    const cursor:number = state.selection.main.head;
    const cursorInRange : boolean = cursor >= from && cursor <= to; 

    if (cursorInRange) return;

    hideMarkers(from, to, MARKER_LENGTHS[name], ranges);
}