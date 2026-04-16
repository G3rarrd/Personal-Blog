import { syntaxTree } from "@codemirror/language";
import { EditorState, Line, RangeSetBuilder } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { DecorationRange } from "../types/DecorationRange";
import { HorizontalRuleWidget } from "../widgets/horizontalRuleWidget";

export const horizontalRulePlugin = ViewPlugin.fromClass(class {
    decorations : DecorationSet;
    constructor(view : EditorView) {
        this.decorations = this.build(view);
    }

    update(update : ViewUpdate) {
    if (update.selectionSet || update.docChanged || update.viewportChanged) {
            this.decorations = this.build(update.view);
        }
    }

    build(view : EditorView) {
        const state : EditorState = view.state;
        const builder  : RangeSetBuilder<Decoration> = new RangeSetBuilder<Decoration>();
        const tree = syntaxTree(state);
        const doc = state.doc;
        const cursorPos = state.selection.main.head;
        const cursorLine : Line = doc.lineAt(cursorPos);
        const ranges : DecorationRange[] = [];

        tree.iterate({
            enter : (node) => {
                const from : number = node.from;
                const to : number = node.to;
                const name : string = node.name;
                const line : Line = doc.lineAt(from);
                const cursorNotAtLine : boolean = cursorLine.number !== line.number;
                if (name === "HorizontalRule" && cursorNotAtLine) {
                    const hrWidget : HorizontalRuleWidget = new HorizontalRuleWidget();
                    const deco = Decoration.replace({
                        widget : hrWidget
                    })

                    ranges.push({from : from, to : to, decoration : deco})
                }
            }
        })

        ranges.sort((a,b) => {
            if (a.from !== b.from) {
                    return a.from - b.from;
                }
                return a.to - b.to;
            })

        for (let r of ranges) {
            builder.add(r.from, r.to, r.decoration);
        }

        return builder.finish();
    }

}, {decorations : view => view.decorations});