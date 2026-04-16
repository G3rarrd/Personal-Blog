import { WidgetType } from "@codemirror/view";

export class HorizontalRuleWidget extends WidgetType {
    constructor (html : string, parentTag : string) {
        super();
    }

    toDOM() :  HTMLElement{
        const hr : HTMLElement = document.createElement("div");
        hr.className = "cm-hr-line";
        return hr;
    }

    ignoreEvent(event: Event): boolean {
         return false;
    }
}