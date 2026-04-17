import { Decoration, EditorView } from "@codemirror/view";
import { DecorationRange } from "../types/DecorationRange";
import { SyntaxNodeRef } from "@lezer/common";
import { EditorState } from "@codemirror/state";



export const hideHeaderMarkerDecorator = (
    view : EditorView, 
    node: SyntaxNodeRef, 
    ranges: DecorationRange[]
): void => {

    const name : string =node.name 

    if (name !== "HeaderMark") return;

    const {from, to} = node;

    const state : EditorState = view.state;

    const doc = state.doc;
    const cursor:number = state.selection.main.head;
    const cursorLine = doc.lineAt(cursor);
    const line = doc.lineAt(from);
    const cursorAtLine : boolean = cursorLine.number === line.number;

    if (cursorAtLine) return;
    ranges.push({from : from , to : to, decoration : Decoration.replace({})});

}