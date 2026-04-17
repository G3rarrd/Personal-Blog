import { EditorState, Line, RangeSetBuilder } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { DecorationRange } from "../types/DecorationRange";
import { syntaxTree } from "@codemirror/language";
import { HTMLWidget } from "../widgets/htmlWidget";
import { StateField, StateEffect } from "@codemirror/state";

type HTMLRegion = {
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
    const htmlBlockRegions: HTMLRegion[] = [];
    const selfClosingTags : Set<string> = new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);
    const doc  = state.doc;
    const cursorPos : number = state.selection.main.head;
    // const cursorLine = doc.lineAt(cursorPos).number;
    const stack: HTMLStack[] = [];
    const tagRe : RegExp = /<\/?[^>]*>/g; // Reg 

    const tree = syntaxTree(state);

    tree.iterate({
        enter(node) {
            const {from , to } = node;
            if (node.name === "HTMLBlock" || node.name === "HTMLTag") {
                const sliceStr : string = doc.sliceString(from, to)

                for (const match of sliceStr.matchAll(tagRe)) {
                    const tag : string = match[0];
                    const tagName : string | undefined = tag.match(/^<\/?([a-zA-Z][a-zA-Z0-9]*)/)?.[1].toLowerCase();
                    if (!tagName) continue;

                    const isClose : boolean = tag[1] === "/";
                    const startTag : number = match.index + from;
                    const endTag : number = startTag + tag.length;

                    if (isClose) {
                        const top = stack.pop();
                        if (!top) continue;

                        if (top.tagName !== tagName) {
                            stack.push(top);
                            continue;
                        }

                        htmlBlockRegions.push({
                            parentTag : top.tagName, 
                            from: top.from, 
                            to: endTag 
                        });
                        
                    } else {
                        const isSelfClosing = tag.endsWith("/>") || selfClosingTags.has(tagName);
                        if (isSelfClosing) continue;
                        stack.push({ tagName, from: startTag });
                    }
                }
            }
        }
    })

    htmlBlockRegions.sort((a, b) => a.from - b.from);

    const mergeRegions = (regions : HTMLRegion[]) => {
        if (regions.length === 0) return [];

        const res: HTMLRegion[] = [];

        let current = htmlBlockRegions[0];

        for (let i = 1; i < htmlBlockRegions.length; i++) {
            const region = htmlBlockRegions[i];

            // overlap or touch
            if (region.from <= current.to) {
                current.to = Math.max(current.to, region.to);
            } else {
                res.push(current);
                current = region;
            }
        }

        res.push(current);

        return res;
    };
    const mergedRegions : HTMLRegion[] = mergeRegions(htmlBlockRegions);
    for (const region of mergedRegions) {
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