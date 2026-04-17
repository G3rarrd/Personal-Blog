import { EditorView } from "codemirror";
import { DecorationRange } from "./DecorationRange";
import { SyntaxNodeRef } from "@lezer/common";

export type DecoratorFn = (
    view: EditorView, 
    node: SyntaxNodeRef, 
    ranges: DecorationRange[]
) => void;
