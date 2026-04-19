import { EditorSelection, EditorState, SelectionRange } from "@codemirror/state";

export const handleNonSelection = (
    state: EditorState,
    range: SelectionRange
    ): { from: number; to: number } => {
    let from = range.from;
    let to = range.to;

    if (from === to) {
        const word = state.wordAt(range.head);

        if (word) {
            from = word.from;
            to = word.to;
        }
    }

    return { from, to };
};

export const trimRange = (
    doc: any, 
    from: number, 
    to: number
): { from: number; to: number } => {
    const text = doc.sliceString(from, to);

    const leading = text.match(/^\s*/)?.[0].length ?? 0;
    const trailing = text.match(/\s*$/)?.[0].length ?? 0;

    return {
        from: from + leading,
        to: to - trailing
    };
}