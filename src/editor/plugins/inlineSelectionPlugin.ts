import { EditorView, Decoration, ViewPlugin, ViewUpdate, DecorationSet } from "@codemirror/view";
import { EditorState, RangeSetBuilder, SelectionRange } from "@codemirror/state";

// Plugin that highlights ONLY selected text ranges
export const inlineSelectionPlugin = ViewPlugin.fromClass(class {
  decorations : DecorationSet;

  constructor(view : EditorView) {
    this.decorations = this.buildDeco(view);
  }

  update(update: ViewUpdate) {
    if (update.selectionSet || update.docChanged) {
      this.decorations = this.buildDeco(update.view);
    }
  }

  buildDeco(view : EditorView) {
    const builder: RangeSetBuilder<Decoration>  = new RangeSetBuilder<Decoration> ;
    const state : EditorState = view.state;
    const ranges: readonly SelectionRange[] = state.selection.ranges; // get the high;oght range
    console.log(ranges);

    for (let range of ranges) {
        if (range.empty) continue;

        builder.add(
            range.from, 
            range.to,
            Decoration.mark({ class: "cm-inline-selection" })
        )
    }

    return builder.finish();
  }
}, {
  decorations: v => v.decorations
});