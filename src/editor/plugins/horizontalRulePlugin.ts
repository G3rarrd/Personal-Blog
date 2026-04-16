import { syntaxTree } from "@codemirror/language";
import { EditorState, Line, RangeSetBuilder } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";

const horizontalRulePlugin = ViewPlugin.fromClass(class {
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

        tree.iterate({
            enter : (node) => {
                const from : number = node.from;
                const to : number = node.to;
                const name : string = node.name;
                const line : Line = doc.lineAt(from);
                const cursorNotAtLine : boolean = cursorLine.number !== line.number;
                if (name === "HorizontalRule") {
                    
                }
            }
        })
    }

}, {decorations : view => view.decorations})