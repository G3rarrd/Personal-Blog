import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { DecorationRange } from "../types/DecorationRange";
import { Decoration } from "@codemirror/view";
import { LinkWidget } from "../widgets/linkWidget";
import { SyntaxNodeRef } from "@lezer/common";

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function linkDecorator(
    view : EditorView, 
    node : SyntaxNodeRef, 
    ranges : DecorationRange[]
) {

    if (node.name !== "Link") return ;

    const {from, to} = node;
    const state : EditorState = view.state;
    const doc = state.doc;
    const cursor = state.selection.main.head;
    const cursorInRange : boolean = cursor >= from && cursor <= to; 
    
    if (cursorInRange) return;

    const linkNode = node.node;
    let url = "";
    let textFrom = 0;
    let textTo = 0;
    let urlFrom : number = 0;
    let urlTo : number = 0;
    
    linkNode.cursor().iterate((child : SyntaxNodeRef) => {
        // // DEBUG
        // console.log(urlText)
        urlFrom  = child.from;
        urlTo  = child.to;

        if (child.name === "URL") {
            url = doc.sliceString(urlFrom , urlTo);
        }

        if (child.name === "LinkMark") {
            const linkMarkText : string = doc.sliceString(urlFrom, urlTo) 
            if (linkMarkText == "[") {
                textFrom = urlTo;
            }
            if (linkMarkText == "]") {
                textTo = urlFrom;
            }
        }
    })

    if (!isValidUrl(url)) return;

    let linkText : string = doc.sliceString(textFrom, textTo);
    const linkWidget : Decoration = Decoration.replace({widget: new LinkWidget(url, linkText)});
    ranges.push({from :from, to : to, decoration: linkWidget});
}  
    
