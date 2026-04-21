import { syntaxTree } from "@codemirror/language";
import { SyntaxNode } from "@lezer/common";
import { EditorSelection, StateCommand, Transaction } from "@codemirror/state";
import { handleNonSelection, trimRange } from "./utils";
import { MarkConfig } from "../types/MarkConfig";


export const toggleMark = (config: MarkConfig): StateCommand => {
  return ({ state, dispatch }) => {
    const changes = state.changeByRange((range) => {
      const doc = state.doc;

      let { from, to } = handleNonSelection(state, range);
      ({ from, to } = trimRange(doc, from, to));

      const tree = syntaxTree(state);
      let node: SyntaxNode | null = tree.resolve(from, 0);

      // Climb to the target node
      while (node && node.name !== config.nodeName) {
        node = node.parent;
      }

      const len = config.marker.length;

      if (node) {
        const inner = doc.sliceString(node.from + len, node.to - len);
        return {
          changes: {
            from: node.from,
            to: node.to,
            insert: inner
          },
          range: EditorSelection.range(
            node.from,
            node.from + inner.length
          )
        };
      }

      const toRemove: { from: number; to: number }[] = [];

      tree.iterate({
        from,
        to,
        enter: (n) => {
          if (n.name === config.nodeName) {
            toRemove.push({ from: n.from, to: n.to });
          }
        }
      });

      toRemove.sort((a, b) => b.from - a.from);

      let text = doc.sliceString(from, to);
      const tmpText : string = text;

      for (const r of toRemove) {
        const inner = doc.sliceString(r.from + len, r.to - len);

        text =
          text.slice(0, r.from - from) +
          inner +
          text.slice(r.to - from);
      }

      let insertText : string = `${config.marker}${text}${config.marker}`;

      if (insertText === tmpText) {
        insertText = text;
        return {
          changes: {
            from: from,
            to: to,
            insert: insertText
          },
          range: EditorSelection.range(
            from,
            from + insertText.length
          )
        };
      }

      return {
        changes: {
          from,
          to,
          insert: insertText
        },
        range: EditorSelection.range(
          from + len,
          from + insertText.length - len
        )
      };
    });

    dispatch(
      state.update(changes, {
        scrollIntoView: true,
        annotations: Transaction.userEvent.of("input"),
      })
    );

    return true;
  };
}

