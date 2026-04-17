import { EditorView, Decoration } from "@codemirror/view";
import { SyntaxNodeRef } from "@lezer/common";
import { DecorationRange } from "../types/DecorationRange";

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

export const headingNodes = new Set([
  "ATXHeading1",
  "ATXHeading2",
  "ATXHeading3",
  "ATXHeading4",
  "ATXHeading5",
  "ATXHeading6",
  "SetextHeading1",
  "SetextHeading2",
]);

export const headingDecorator = (
    view: EditorView,
    node: SyntaxNodeRef,
    ranges: DecorationRange[]
) => {
    if (!headingNodes.has(node.name)) return;

    const cls = headingClasses[node.name];
    if (!cls) return;

    const decoration = Decoration.line({ class: cls });

    ranges.push({
    from: node.from,
    to: node.from,
    decoration
  });
}