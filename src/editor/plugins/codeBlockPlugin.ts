import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";

import { DecorationRange } from "../types/DecorationRange";

export const CodeBlockPlugin = ViewPlugin.fromClass(
    class {
        decorations : DecorationSet;
        constructor(view : EditorView) {
            this.decorations = this.build(view)
        }

        update(update : ViewUpdate) {
            if (update.selectionSet || update.docChanged || update.viewportChanged) {
                this.decorations = this.build(update.view);
            }
        }

        build(view :EditorView) {
            const state = view.state;
            const cursorPos : number = state.selection.main.head;
            const doc = state.doc
            const tree = syntaxTree(state);
            const builder = new RangeSetBuilder<Decoration>();
            const ranges : DecorationRange[] = [];

            tree.iterate({
                enter: (node) => {
                    const from : number = node.from;
                    const to : number = node.to;
                    const name : string = node.name;

                    if (name === "FencedCode") {
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
                }
            })

            ranges.sort((a, b) => {
                if (a.from != b.from) {
                    return a.from - b.from;
                }

                return a.to - b.to;
            })

            for (const r of ranges) {
                builder.add(r.from, r.to, r.decoration);
            }
            return builder.finish();
        }
    }, {decorations : view => view.decorations}
)