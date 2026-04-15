import { HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";

export const classHighlightStyle = HighlightStyle.define([
    // comments
    { tag: tags.comment,                class: "cmt-comment" },
    { tag: tags.lineComment,            class: "cmt-lineComment" },
    { tag: tags.blockComment,           class: "cmt-blockComment" },
    { tag: tags.docComment,             class: "cmt-docComment" },

    // names
    { tag: tags.name,                   class: "cmt-name" },
    { tag: tags.variableName,           class: "cmt-variableName" },
    { tag: tags.typeName,               class: "cmt-typeName" },
    { tag: tags.tagName,                class: "cmt-tagName" },
    { tag: tags.propertyName,           class: "cmt-propertyName" },
    { tag: tags.attributeName,          class: "cmt-attributeName" },
    { tag: tags.className,              class: "cmt-className" },
    { tag: tags.labelName,              class: "cmt-labelName" },
    { tag: tags.namespace,              class: "cmt-namespace" },
    { tag: tags.macroName,              class: "cmt-macroName" },

    // literals
    { tag: tags.literal,                class: "cmt-literal" },
    { tag: tags.string,                 class: "cmt-string" },
    { tag: tags.docString,              class: "cmt-docString" },
    { tag: tags.character,              class: "cmt-character" },
    { tag: tags.attributeValue,         class: "cmt-attributeValue" },
    { tag: tags.number,                 class: "cmt-number" },
    { tag: tags.integer,                class: "cmt-integer" },
    { tag: tags.float,                  class: "cmt-float" },
    { tag: tags.bool,                   class: "cmt-bool" },
    { tag: tags.regexp,                 class: "cmt-regexp" },
    { tag: tags.escape,                 class: "cmt-escape" },
    { tag: tags.color,                  class: "cmt-color" },
    { tag: tags.url,                    class: "cmt-url" },

    // keywords
    { tag: tags.keyword,                class: "cmt-keyword" },
    { tag: tags.self,                   class: "cmt-self" },
    { tag: tags.null,                   class: "cmt-null" },
    { tag: tags.atom,                   class: "cmt-atom" },
    { tag: tags.unit,                   class: "cmt-unit" },
    { tag: tags.modifier,               class: "cmt-modifier" },
    { tag: tags.operatorKeyword,        class: "cmt-operatorKeyword" },
    { tag: tags.controlKeyword,         class: "cmt-controlKeyword" },
    { tag: tags.definitionKeyword,      class: "cmt-definitionKeyword" },
    { tag: tags.moduleKeyword,          class: "cmt-moduleKeyword" },

    // operators
    { tag: tags.operator,               class: "cmt-operator" },
    { tag: tags.derefOperator,          class: "cmt-derefOperator" },
    { tag: tags.arithmeticOperator,     class: "cmt-arithmeticOperator" },
    { tag: tags.logicOperator,          class: "cmt-logicOperator" },
    { tag: tags.bitwiseOperator,        class: "cmt-bitwiseOperator" },
    { tag: tags.compareOperator,        class: "cmt-compareOperator" },
    { tag: tags.updateOperator,         class: "cmt-updateOperator" },
    { tag: tags.definitionOperator,     class: "cmt-definitionOperator" },
    { tag: tags.typeOperator,           class: "cmt-typeOperator" },
    { tag: tags.controlOperator,        class: "cmt-controlOperator" },

    // punctuation
    { tag: tags.punctuation,            class: "cmt-punctuation" },
    { tag: tags.separator,              class: "cmt-separator" },
    { tag: tags.bracket,                class: "cmt-bracket" },
    { tag: tags.angleBracket,           class: "cmt-angleBracket" },
    { tag: tags.squareBracket,          class: "cmt-squareBracket" },
    { tag: tags.paren,                  class: "cmt-paren" },
    { tag: tags.brace,                  class: "cmt-brace" },

    // content (markdown)
    { tag: tags.content,                class: "cmt-content" },
    { tag: tags.heading,                class: "cmt-heading" },
    { tag: tags.heading1,               class: "cmt-heading1" },
    { tag: tags.heading2,               class: "cmt-heading2" },
    { tag: tags.heading3,               class: "cmt-heading3" },
    { tag: tags.heading4,               class: "cmt-heading4" },
    { tag: tags.heading5,               class: "cmt-heading5" },
    { tag: tags.heading6,               class: "cmt-heading6" },
    { tag: tags.contentSeparator,       class: "cmt-contentSeparator" },
    { tag: tags.list,                   class: "cmt-list" },
    { tag: tags.quote,                  class: "cmt-quote" },
    { tag: tags.emphasis,               class: "cmt-emphasis" },
    { tag: tags.strong,                 class: "cmt-strong" },
    { tag: tags.link,                   class: "cmt-link" },
    { tag: tags.monospace,              class: "cmt-monospace" },
    { tag: tags.strikethrough,          class: "cmt-strikethrough" },

    // change tracking
    { tag: tags.inserted,               class: "cmt-inserted" },
    { tag: tags.deleted,                class: "cmt-deleted" },
    { tag: tags.changed,                class: "cmt-changed" },

    // invalid
    { tag: tags.invalid,                class: "cmt-invalid" },

    // meta
    { tag: tags.meta,                   class: "cmt-meta" },
    { tag: tags.documentMeta,           class: "cmt-documentMeta" },
    { tag: tags.annotation,             class: "cmt-annotation" },
    { tag: tags.processingInstruction,  class: "cmt-processingInstruction" },
])