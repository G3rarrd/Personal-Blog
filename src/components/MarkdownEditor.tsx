"use client";

import {basicSetup, minimalSetup} from "codemirror"
import { indentMore, indentLess } from "@codemirror/commands";
import { EditorState, RangeSetBuilder } from '@codemirror/state'
import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate, WidgetType, lineNumbers, highlightSpecialChars, drawSelection, dropCursor, keymap } from "@codemirror/view";
import { ChevronDown, ChevronRight } from "lucide-react"
import { useEffect, useRef } from 'react'
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import {  foldGutter, syntaxHighlighting, } from "@codemirror/language";
// import { oneDark } from "@codemirror/theme-one-dark";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";
import { languages } from "@codemirror/language-data"; // actual language data
import { headingPlugin } from "@/editor/plugins/headingPlugin";
import { hideMarkdownSyntaxPlugin } from "@/editor/plugins/hideMarkdownSyntaxPlugin";

import { hideHtmlPlugin } from "@/editor/plugins/hideHtmlPlugin";
import { ThemeName } from "@/editor/themes";

// import all CSS once — bundler handles deduplication
import "../editor/themes/base.css"
import "../editor/themes/obsidian.css"
import "../editor/themes/tokyoNight.css"

import { renderToStaticMarkup } from "react-dom/server";
import { classHighlightStyle } from "@/editor/themes/highlightStyle";
import { html } from "@codemirror/lang-html";
import { CodeBlockPlugin } from "@/editor/plugins/codeBlockPlugin";
import { horizontalRulePlugin } from "@/editor/plugins/horizontalRulePlugin";

interface MarkdownEditor {
    flexRatio: number;
    theme: ThemeName
    value?: string
}


const MarkdownEditor = ({flexRatio, theme, value}: MarkdownEditor) => {
    const editorRef = useRef<HTMLDivElement | null>(null)
    const viewRef = useRef<EditorView | null>(null)

    // Mount once
    useEffect(() => {
        if (!editorRef.current) return

        const state : EditorState = 
        EditorState.create({
            doc: value,
            extensions:[
                // Basic Editor Setup
                minimalSetup,
                keymap.of([
                    { key: "Tab", run: indentMore },
                    { key: "Shift-Tab", run: indentLess }
                ]),
                
                EditorView.lineWrapping, // <-- This enables wrapping
                
                // 
                foldGutter({
                    markerDOM(open) {
                        const el = document.createElement("span")
                        el.innerHTML = open
                        ? renderToStaticMarkup(<ChevronDown size={12} />)
                                    : renderToStaticMarkup(<ChevronRight size={12} />)
                                    return el
                    }
                }),

                // Markdown Parser 
                 markdown({
                            base: markdownLanguage,
                            codeLanguages: languages,
                            addKeymap: true,
                        }),

                // Disable inbrower auto-correct including grammarly
                EditorView.contentAttributes.of({
                    // Specifically for Grammarly
                    "data-gramm": "false",
                    "data-gramm_editor": "false",
                    "data-enable-grammarly": "false",
                    
                    // For browser native features that also mess with code
                    "spellcheck": "false",
                    "autocorrect": "off",
                    "autocapitalize": "off"
                    }),

                syntaxHighlighting(classHighlightStyle),
                
                // My custom Plugins
                horizontalRulePlugin,
                headingPlugin,
                hideMarkdownSyntaxPlugin,
                hideHtmlPlugin,
                CodeBlockPlugin,
            ]
        })

        const view = new EditorView({
            state,
            parent: editorRef.current
        })

        viewRef.current = view
        
        // Prevents memory leaks when the component unmounts
        return () => {
            view.destroy()
            viewRef.current?.destroy()
            viewRef.current = null
        }
    }, [])

  return (
    <div 
        className={`flex justify-center w-full h-full overflow-auto theme-${theme}`} 
        style={{ 
            flex: 1 - flexRatio,
            backgroundColor: "var(--cm-background)"
        }}
    >
        <div 
            ref={editorRef} 
            className={`theme-${theme} w-full max-w-4xl h-80`} 
        />
    </div>
)
}

export default MarkdownEditor