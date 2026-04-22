import { EditorView } from "codemirror";
import { SyntaxNodeRef } from "@lezer/common";
import { DecorationRange } from "../types/DecorationRange";
import { DockIcon } from "lucide-react";
import { CheckboxWidget } from "../widgets/checkboxWidget";
import { Line } from "@codemirror/state";
import { Decoration } from "@codemirror/view";


const toggleTask = (
    view : EditorView, 
    from: number ,
    to: number, 
    checked : boolean) => {
    const newText = checked ? "- [x]" : "- [ ]";

    view.dispatch({
        changes: {
            from: from ,
            to: to,
            insert: newText
        }
    });
}

export const taskMarkerDecorator = (
    view: EditorView,
    node: SyntaxNodeRef,
    ranges: DecorationRange[]
) => {

    const state = view.state;
    const doc = state.doc;

    const from = node.from - 2;
    const to = node.to;

    const cursor = state.selection.main.head;

    const text : string = doc.sliceString(from, to);
    
    const cursorInRange : boolean = cursor >= from && cursor <= to; 
    
    if (cursorInRange) return;

    const match = text.match(/^- \[( |x)\]/);
    if (!match) return;

    const checked = match[1] === "x";
    const checkboxWidget = new CheckboxWidget(checked, (value) => {
        toggleTask(view, from, to, value)
    })
    const deco : Decoration = Decoration.replace({widget: checkboxWidget})
    // ranges.push({from: from, to : from +2, decoration: Decoration.replace({})})
    ranges.push({from: from, to : to, decoration: deco})
    console.log(node.name, state.doc.sliceString(from, to))
}