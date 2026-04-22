import { WidgetType } from "@codemirror/view"

export class CheckboxWidget extends WidgetType {
    checked : boolean;
    onChange : (checked: boolean) => void;
    constructor(checked : boolean, onChange : (checked: boolean) => void) {
        super();
        this.checked = checked;
        this.onChange = onChange;
    }

    eq(other : CheckboxWidget) :boolean {
        return other.checked === this.checked;
    }

    toDOM() {
        const wrap = document.createElement("span");

        wrap.className = "cm-checkbox";
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = this.checked;

        checkbox.addEventListener("click", () => {
            this.onChange(checkbox.checked);
        });

        wrap.appendChild(checkbox);
        return wrap;
    }

    updateDOM(dom: HTMLElement) {
        const input = dom.querySelector("input");
        if (input) input.checked = this.checked;
        return true;
    }

    ignoreEvent() {
        return true;
    }
}