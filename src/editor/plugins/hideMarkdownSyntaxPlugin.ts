import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { DecorationRange } from "../types/DecorationRange";
import { LinkWidget } from "../widgets/linkWidget";

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// For hiding the italics, bold, and strikethrough markers.
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


export const hideMarkdownSyntaxPlugin = ViewPlugin.fromClass(
    class {
        decorations : DecorationSet
        constructor(view : EditorView) {
            this.decorations = this.build(view)
        }

        update(update : ViewUpdate) {
            if (update.selectionSet || update.docChanged || update.viewportChanged) {
                this.decorations = this.build(update.view);
            }
        }

        build(view : EditorView) {
            const state  = view.state
            const builder : RangeSetBuilder<Decoration> = new RangeSetBuilder<Decoration>();
            const tree = syntaxTree(state );
            const ranges : DecorationRange[] = [] 

            const doc = state.doc;
            const cursorPos = state.selection.main.head;
            const cursorLine = doc.lineAt(cursorPos);

             tree.iterate({
                enter: (node) => {
                    const from = node.from;
                    const to = node.to;
                    const line = doc.lineAt(from);
                    const name : string = node.name;
                    const text = doc.sliceString(from, to);
                    // console.log(node.name, node.from, node.to)
                    
                    // DEBUG
                    console.log(text, name)
                    
                    const cursorNotAtLine : boolean = cursorLine.number !== line.number;
                    
                    // Hide '#' symbol when cursor is not on the line
                    if (name === "HeaderMark" && cursorNotAtLine) {
                        ranges.push({from : from , to : to, decoration : Decoration.replace({})});
                    }

                    const cursorNotInRange : boolean = cursorPos < from || cursorPos > to; // for syntax such as italics, bold, code
                    // Handle simple markers (*, **, ~, `, etc.)
                    if (cursorNotInRange && MARKER_LENGTHS[name]) {
                        hideMarkers(from, to, MARKER_LENGTHS[name], ranges);
                    }

                    if (name === "Link") {
                        const linkNode = node.node;
                        let url = "";
                        let textFrom = 0;
                        let textTo = 0;
                        let urlFrom : number = 0;
                        let urlTo : number = 0;
                        
                        linkNode.cursor().iterate((child) => {
                            // // DEBUG
                            // console.log(urlText)
                            urlFrom  = child.from
                            urlTo  = child.to
                            if (child.name === "URL") {
                                url = doc.sliceString(urlFrom , urlTo);
                            }

                            if (child.name === "LinkMark") {
                                const linkMarkText : string = doc.sliceString(urlFrom, urlTo) 
                                if (linkMarkText == "[") {
                                    textFrom = urlTo
                                }
                                if (linkMarkText == "]") {
                                    textTo = urlFrom
                                }
                            }
                        })

                        let linkText : string = doc.sliceString(textFrom, textTo)
                        if (cursorNotInRange && isValidUrl(url)) {
 
                            const linkWidget : Decoration = Decoration.replace({
                                    widget: new LinkWidget(url, linkText),
                                })
                            ranges.push({from :from, to : to, decoration: linkWidget})
                        }  
                    }
                }
            })

            ranges.sort((a, b) => {
                if (a.from !== b.from) {
                    return a.from - b.from;
                }
                return a.to - b.to;
            })


            for (let r of ranges) {
                builder.add(r.from, r.to, r.decoration);
            }

            return builder.finish()
        }
    }, {decorations : view => view.decorations})