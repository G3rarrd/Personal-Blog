import { WidgetType } from "@codemirror/view";

// Create a HTML element to replace the Link node name
export class LinkWidget extends WidgetType {
    url: string;
    text: string;
    constructor(url: string, text: string) {
        super();
        this.url = url;
        this.text = text;
    }
    toDOM() {
        const a = document.createElement("a");
        a.href = this.url;
        a.textContent = this.text;
        a.target = "_blank";
        a.className = "cm-link";
        a.style.cursor = "pointer";
        return a;
    }
}