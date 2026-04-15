import { EditorState, Line, RangeSetBuilder } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { DecorationRange } from "../types/DecorationRange";
import { syntaxTree } from "@codemirror/language";
import { HTMLWidget } from "../widgets/htmlWidget";
import { StateField, StateEffect } from "@codemirror/state";

type HtmlRegion = {
    parentTag : string;
    from: number;
    to: number;
}

type HTMLStack = {
    tagName : string;
    from : number;
}

export const hideHtmlPlugin = StateField.define<DecorationSet>({
    create(state : EditorState) {
        return build(state);
    },
    update(decorations : DecorationSet, tr ) {
        if (tr.docChanged || tr.selection) {
            return build(tr.state);
        }
        return decorations.map(tr.changes);
    },
    provide(field : StateField<DecorationSet>) {
        return EditorView.decorations.from(field);
    }
});

function build(state: EditorState): DecorationSet {
    const builder = new RangeSetBuilder<Decoration>();
    const htmlBlockRegions: HtmlRegion[] = [];
    const selfClosingTags : Set<string> = new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);
    const doc  = state.doc;
    const cursorPos : number = state.selection.main.head;
    // const cursorLine = doc.lineAt(cursorPos).number;
    const stack: HTMLStack[] = [];
    const tagRe : RegExp = /<\/?[^>]*>/g; // Reg 


    for (let i = 1; i <= doc.lines; i++) {
        const line = doc.line(i);

        for (const match of line.text.matchAll(tagRe)) {
            const tag : string = match[0];
            const tagName : string | undefined = tag.match(/^<\/?([a-zA-Z][a-zA-Z0-9]*)/)?.[1].toLowerCase();
            if (!tagName) continue;

            const isClose : boolean = tag[1] === "/";
            const startTag : number = line.from + match.index;
            const endTag : number = startTag + tag.length;

            if (isClose) {
                const top = stack.pop();
                if (!top) continue;
                if (top.tagName !== tagName) {
                    stack.push(top);
                    continue;
                }
                if (stack.length === 0) {
                    htmlBlockRegions.push({parentTag : top.tagName, from: top.from, to: endTag });
                }
            } else {
                const isSelfClosing = tag.endsWith("/>") || selfClosingTags.has(tagName);
                if (isSelfClosing) continue;
                stack.push({ tagName, from: startTag });
            }
        }
    }

    htmlBlockRegions.sort((a, b) => a.from - b.from);

    for (const region of htmlBlockRegions) {
        const { parentTag, from, to } = region;

        const cursorNotInRange = cursorPos < from || cursorPos > to; // outside range

        if (cursorNotInRange) {
            const htmlCode = doc.sliceString(from, to);
            builder.add(
                from,
                to,
                Decoration.replace({widget: new HTMLWidget(htmlCode, parentTag)}));
        }
    }

    return builder.finish();
}