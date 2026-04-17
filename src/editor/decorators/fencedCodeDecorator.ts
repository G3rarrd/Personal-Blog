import { EditorView } from "codemirror";
import { SyntaxNodeRef } from "@lezer/common";
import { DecorationRange } from "../types/DecorationRange";
import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";
import { Decoration } from "@codemirror/view";

export const fencedCodeDecorator = (view : EditorView, node : SyntaxNodeRef, ranges : DecorationRange[]) : void => {
    if (node.name !== "FencedCode" ) return;

    const state = view.state;
    const cursorPos : number = state.selection.main.head;
    const doc = state.doc

    const {from, to} = node;

    const fenceCodeID : string =`${from}-${to}`;
    const infoNode = node.node.getChild("CodeInfo");
    const codeNode = node.node.getChild("CodeText");

    
    const lang = infoNode 
    ? state.doc.sliceString(infoNode.from, infoNode.to).trim().toLowerCase()
    : "";
    
    const code = codeNode 
    ? state.doc.sliceString(codeNode.from, codeNode.to)
    : "";
    
    console.log(code, lang);
    const cursorNotInRange = cursorPos < from || cursorPos > to;

    const startLine = doc.lineAt(from);
    const endLine = doc.lineAt(to);


    if (cursorNotInRange) {
        ranges.push({from : startLine.from, to: startLine.to, decoration : Decoration.replace({})})
        ranges.push({from : endLine.from, to: endLine.to, decoration : Decoration.replace({})})
    }

    for (let i = startLine.number; i <= endLine.number; i++) {
            let position: "first" | "middle" | "last";

        if (i === startLine.number) {
            position = "first";
        } else if (i === endLine.number) {
            position = "last";
        } else {
            position = "middle";
        }

        const line = doc.line(i);
        ranges.push({
            from: line.from,
            to: line.from,
            decoration: Decoration.line({
                class : `cm-codeblock cm-${position}`,
                attributes : {
                    "data-position": position,
                    "data-id":fenceCodeID
                }
            })
        });
    }
}