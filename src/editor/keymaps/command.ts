import { EditorState } from "@codemirror/state";
import { EditorView } from "codemirror";

// export const insertHello = (view : EditorView) => {
//     const {from} = view.state.selection.main;

//     view.dispatch({
//         changes: {from, insert: "Hello"}
//     });

//     return true;
// }

export const toggleBold = (view: EditorView) => {
    const state = view.state;
    const doc = state.doc;
    const { from, to } = state.selection.main;

    let text = doc.sliceString(from, to);

    // Case 1: selection already wrapped
    if (text.startsWith("**") && text.endsWith("**")) {
        view.dispatch({
            changes: {
                from,
                to,
                insert: text.slice(2, -2)
            },
        });
        return true;
    }

    // Case 2: selection inside bold
    const startText = doc.sliceString(Math.max(0, from - 2), from);
    const endText = doc.sliceString(to, Math.min(doc.length, to + 2));

    if (startText === "**" && endText === "**") {
        view.dispatch({
            changes: {
                from: from - 2,
                to: to + 2,
                insert: text
            },
            
            selection: {
                anchor: from - 2,
                head: to - 2
            }
        });

        return true;
    }

    // Case 3: apply bold
    view.dispatch({
        changes: {
            from,
            to,
            insert: `**${text}**`
        },
        selection: {
                anchor: from + 2 ,
                head: to + 2 
            }
    });

    return true;
};
 
// export const toggleItalics = (view: EditorView) => {
//     const state = view.state;
//     const doc = state.doc;
//     const { from, to } = state.selection.main;

//     let text = doc.sliceString(from, to);

//     // Case 1: selection already wrapped
//     if (text.startsWith("*") && text.endsWith("*")) {
//         view.dispatch({
//             changes: {
//                 from,
//                 to,
//                 insert: text.slice(1, -1)
//             }
//         });
//         return true;
//     }

//     // Case 2: selection inside bold
//     const startText = doc.sliceString(Math.max(0, from - 1), from);
//     const endText = doc.sliceString(to, Math.min(doc.length, to + 1));

//     if (startText === "*" && endText === "*") {
//         view.dispatch({
//             changes: {
//                 from: from - 1,
//                 to: to + 1,
//                 insert: text
//             },

//             selection: {
//                 anchor: from - 1,
//                 head: to - 1
//             }
//         });

//         return true;
//     }

//     // Case 3: apply bold
//     view.dispatch({
//         changes: {
//             from,
//             to,
//             insert: `*${text}*`
//         },
//         selection: {
//             anchor: from + 1,
//             head: to + 1
//         }
//     });

//     return true;
// };
 