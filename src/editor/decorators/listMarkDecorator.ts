import { Decoration, EditorView } from "@codemirror/view";
import { DecorationRange } from "../types/DecorationRange";
import { SyntaxNodeRef } from "@lezer/common";
import { EditorState } from "@codemirror/state";
import { BulletWidget } from "../widgets/bulletWidget";
import { syntaxTree } from "@codemirror/language";


export const listMarkNode = new Set([
    "OrderedList",
    "BulletList",
]);

export const listMarkDecorator = (
    view : EditorView, 
    node: SyntaxNodeRef, 
    ranges: DecorationRange[]
): void => {

    const name : string =node.name 

    if (listMarkNode.has(name)) return;

    
    const {from, to} = node;
    
    const state : EditorState = view.state;
    const doc = state.doc;
    const line = doc.lineAt(from);

    const text = line.text;

    const isTask = /^\s*[-*] \[( |x)\]/.test(text);

    if (isTask) return; // hide bullet for tasks

    const listStr: string = state.doc.sliceString(from, to); 
    const cursor:number = state.selection.main.head;
    const cursorInRange : boolean = cursor >= from && cursor <= to; 
    
    if (cursorInRange) return;
    
    if (listStr === "-" || listStr === "*") {
        const bulletWidget : BulletWidget = new BulletWidget();
        const deco : Decoration = Decoration.replace({widget : bulletWidget});
        ranges.push({from : from , to : to, decoration : deco});
    }
}