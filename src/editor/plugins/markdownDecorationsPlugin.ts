import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { DecorationRange } from "../types/DecorationRange";
import { linkDecorator } from "../decorators/linkDecorator";
import { hideInlineMarkdownsDecorator, inlineNodes } from "../decorators/hideInlineMarkdownDecorators";
import { hideHeaderMarkerDecorator } from "../decorators/hideHeaderMarkDecorator";
import { fencedCodeDecorator } from "../decorators/fencedCodeDecorator";
import { headingDecorator, headingNodes } from "../decorators/headingDecorator";
import { horizontalRuleDecorator } from "../decorators/horizontalLineDecoration";
import { listMarkDecorator, listMarkNode as listMarkNodes } from "../decorators/listMarkDecorator";
import { DecoratorFn } from "../types/DecoratorFn";
import { taskMarkerDecorator } from "../decorators/taskMarkerDecorator";


const decoratorConfig: Partial<Record<string, DecoratorFn>> = {
    HeaderMark: hideHeaderMarkerDecorator,
    Link: linkDecorator,
    FencedCode: fencedCodeDecorator,
    HorizontalRule: horizontalRuleDecorator,
    ListMark: listMarkDecorator,
    TaskMarker: taskMarkerDecorator,
  
    ...Object.fromEntries(
    [...headingNodes].map(
            (name): [string, DecoratorFn] => [name, headingDecorator]
        )
    ),

    ...Object.fromEntries(
    [...inlineNodes].map(
            (name): [string, DecoratorFn] => [name, hideInlineMarkdownsDecorator]
        )
    ),

    ...Object.fromEntries(
    [...listMarkNodes].map(
            (name): [string, DecoratorFn] => [name, listMarkDecorator]
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

            for (let {from, to} of view.visibleRanges) {
                syntaxTree(state).iterate({
                    from,
                    to,
                    enter: (node) => {
                    //    console.log(node.name);
                        const decorator = decoratorConfig[node.name];
                        if (!decorator) return;
                        decorator(view, node, ranges);
                    }
                });
            }

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