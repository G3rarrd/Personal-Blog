import { EditorView, Decoration } from "@codemirror/view";
import { SyntaxNodeRef } from "@lezer/common";
import { DecorationRange } from "../types/DecorationRange";
import { HorizontalRuleWidget } from "../widgets/horizontalRuleWidget";

export const horizontalRuleDecorator = (
    view: EditorView,
    node: SyntaxNodeRef,
    ranges: DecorationRange[]
): void => {
    const state = view.state;
    const doc = state.doc;

    const from = node.from;
    const to = node.to;

    const cursorPos = state.selection.main.head;
    const cursorLine = doc.lineAt(cursorPos);
    const line = doc.lineAt(from);

    const cursorNotAtLine = cursorLine.number !== line.number;

    if (node.name !== "HorizontalRule") return;
    
    if (!cursorNotAtLine) return;

    const deco = Decoration.replace({
        widget: new HorizontalRuleWidget()
    });

    ranges.push({
        from,
        to,
        decoration: deco
    });
};