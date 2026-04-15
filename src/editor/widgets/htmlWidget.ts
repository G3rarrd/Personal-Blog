import { WidgetType } from "@codemirror/view";
import DOMPurify from "dompurify";

export class HTMLWidget extends WidgetType {
    html : string;
    parentTag : string;
    constructor (html : string, parentTag : string) {
        super();
        this.html = html;
        this.parentTag = parentTag;
    }

    toDOM() :  HTMLElement{
        const wrapper : HTMLElement = document.createElement(this.parentTag);
        wrapper.className = "cm-html-block";
        wrapper.style.margin = "0";
        wrapper.style.padding = "0";
        console.log(this.html)
        const clean : string = DOMPurify.sanitize(this.html, { USE_PROFILES: { html: true } });
        const parser : DOMParser = new DOMParser();
        const parsed : Document = parser.parseFromString(clean, "text/html");
        
        // move parsed nodes into wrapper
        parsed.body.childNodes.forEach(node => wrapper.appendChild(node.cloneNode(true)));

        return wrapper;
    }

    eq(other: HTMLWidget) : boolean {
        return other.html === this.html; // skip re-render if unchanged
    }

    ignoreEvent(event: Event): boolean {
         return false;
    }
}