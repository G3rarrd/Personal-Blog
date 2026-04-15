import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { DecorationRange } from "../types/DecorationRange";

export const headingPlugin = ViewPlugin.fromClass(
    class {
        decorations: DecorationSet;
        constructor(view: EditorView) {
            this.decorations = this.build(view);
        }

        update(update : ViewUpdate) {
            if (update.docChanged || update.selectionSet || update.viewportChanged) {
                this.decorations = this.build(update.view);
            }
        }

        build(view: EditorView) {
            const builder = new RangeSetBuilder<Decoration>();
            const tree = syntaxTree(view.state);
            const ranges : DecorationRange[] = [] 

            const headingClasses: Record<string, string> = {
                ATXHeading1: "cm-h1",
                ATXHeading2: "cm-h2",
                ATXHeading3: "cm-h3",
                ATXHeading4: "cm-h4",
                ATXHeading5: "cm-h5",
                ATXHeading6: "cm-h6",
                SetextHeading1: "cm-h1",
                SetextHeading2: "cm-h2",
            };

            tree.iterate({
                enter: (node) => {
                    const cls : string = headingClasses[node.name];
                    if (!cls) return;
                    const addClass : Decoration = Decoration.line({class: cls}) 
                    ranges.push({from : node.from, to : node.from, decoration: addClass})
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