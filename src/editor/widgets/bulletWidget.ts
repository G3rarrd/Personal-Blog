import { WidgetType } from "@codemirror/view";

export class BulletWidget extends WidgetType {
    constructor() { super();}

    toDOM() : HTMLSpanElement{
        const span : HTMLSpanElement = document.createElement("span");
        span.className = "cm-bullet-mark";
        const bullet : string = "•"
        span.textContent = bullet;
        return span;
    }

    ignoreEvent(event: Event): boolean {
        return false;
    }
} 