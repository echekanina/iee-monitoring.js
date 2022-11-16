import IeecloudWidget from "./widgets/IeecloudWidget.js";

export default class IeecloudWidgetRow {
    layoutModel;
    observableObject;
    #template = ``;

    constructor(layoutModel, observableObject) {
        this.layoutModel = layoutModel;
        this.observableObject = observableObject;
    }

    generateTemplate() {
        this.#template = `<div class="row" id="row-widgets-container-` + this.layoutModel.id + `"></div>`;
        return this.#template;
    }

    insertTemplates() {
        const scope = this;
        const containerElement = document.querySelector("#row-widgets-container-" + this.layoutModel.id);
        this.layoutModel.widgets.forEach(function(widgetModel){
            let widget = new IeecloudWidget(widgetModel, scope.observableObject);
            let widgetTemplate = widget.generateTemplate();
            containerElement.insertAdjacentHTML('beforeend', widgetTemplate);
            widget.insertTemplates();
        });
    }
}