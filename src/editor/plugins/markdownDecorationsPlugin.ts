import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { DecorationRange } from "../types/DecorationRange";
import { LinkWidget } from "../widgets/linkWidget";
import { linkDecorator } from "../decorators/linkDecorator";
import { hideInlineMarkdownsDecorator, inlineNodes } from "../decorators/hideInlineMarkdownDecorators";
import { hideHeaderMarkerDecorator } from "../decorators/hideHeaderMarkDecorator";
import { SyntaxNodeRef } from "@lezer/common";
import { fencedCodeDecorator } from "../decorators/fencedCodeDecorator";
import { headingDecorator, headingNodes } from "../decorators/headingDecorator";
import { horizontalRuleDecorator } from "../decorators/horizontalLineDecoration";
import { bulletDecorator } from "../decorators/listMarkDecorator";

type decoratorFn = (
    view: EditorView, 
    node: SyntaxNodeRef, 
    ranges: DecorationRange[]
) => void;


const decoratorConfig: Partial<Record<string, decoratorFn>> = {
  HeaderMark: hideHeaderMarkerDecorator,
  Link: linkDecorator,
  FencedCode: fencedCodeDecorator,
  HorizontalRule: horizontalRuleDecorator,
  ListMark: bulletDecorator,
  
  ...Object.fromEntries(
    [...headingNodes].map(
      (name): [string, decoratorFn] => [name, headingDecorator]
    )
  ),

  ...Object.fromEntries(
    [...inlineNodes].map(
      (name): [string, decoratorFn] => [name, hideInlineMarkdownsDecorator]
    )
  ),

};


export const markdownDecorationsPlugin = ViewPlugin.fromClass(
    class {
        decorations : DecorationSet
        constructor(view : EditorView) {
            this.decorations = this.build(view);
        }

        update(update : ViewUpdate) {
            if (update.selectionSet || update.docChanged || update.viewportChanged) {
                this.decorations = this.build(update.view);
            }
        }

        build(view : EditorView) {
            const state  = view.state
            const ranges : DecorationRange[] = [];
            const builder : RangeSetBuilder<Decoration> = new RangeSetBuilder<Decoration>();

            syntaxTree(state).iterate({
                enter: (node) => {
                    console.log(node.name, state.doc.sliceString(node.from, node.to))
                    const decorator = decoratorConfig[node.name];
                    if (!decorator) return;
                    decorator(view, node, ranges);
                }
            });

            ranges.sort((a, b) => {
                if (a.from !== b.from) {
                    return a.from - b.from;
                }
                return a.to - b.to;
            });

            for (let r of ranges) {
                builder.add(r.from, r.to, r.decoration);
            }

            return builder.finish();
        }

    }, {decorations : view => view.decorations});