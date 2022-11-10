import IeecloudWidget from "./IeecloudWidget.js";

export default class IeecloudWidgetRow {
    model;
    #template = ``;

    constructor(model) {
        this.model = model;
    }

    generateTemplate() {
        this.#template = `<div class="row" id="row-widgets-container-` + this.model.id + `"></div>`;
        return this.#template;
    }

    insertTemplates() {
        const containerElement = document.querySelector("#row-widgets-container-" + this.model.id);
        this.model.widgets.forEach(function(widgetModel){
            let widget = new IeecloudWidget(widgetModel);
            let widgetTemplate = widget.generateTemplate();
            containerElement.insertAdjacentHTML('beforeend', widgetTemplate);
            widget.insertTemplates();
        });
    }
}