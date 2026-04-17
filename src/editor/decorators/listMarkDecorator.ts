import { Decoration, EditorView } from "@codemirror/view";
import { DecorationRange } from "../types/DecorationRange";
import { SyntaxNodeRef } from "@lezer/common";
import { EditorState } from "@codemirror/state";
import { BulletWidget } from "../widgets/bulletWidget";



export const bulletDecorator = (
    view : EditorView, 
    node: SyntaxNodeRef, 
    ranges: DecorationRange[]
): void => {

    const name : string =node.name 

    if (name !== "ListMark") return;

    const {from, to} = node;

    const state : EditorState = view.state;
    const cursor:number = state.selection.main.head;
    const cursorInRange : boolean = cursor >= from && cursor <= to; 

    if (cursorInRange) return;

    const bulletWidget : BulletWidget = new BulletWidget();
    const deco : Decoration = Decoration.replace({widget : bulletWidget})
    ranges.push({from : from , to : to, decoration : deco});

}