import IeecloudWidgetRenderer from "./IeecloudWidgetRenderer.js";

export default class IeecloudWidgetRowRenderer {
    #layoutModel;
    #node;

    constructor(layoutModel, node) {
        this.#layoutModel = layoutModel;
        this.#node = node;
    }

    generateTemplate() {
        return `<div class="row" id="row-widgets-container-` + this.#layoutModel.id + `"></div>`;
    }

    render(container){
        const scope = this;
        let widgetRowTemplate = this.generateTemplate();
        container.insertAdjacentHTML('beforeend', widgetRowTemplate);


        const containerElement = document.querySelector("#row-widgets-container-" + this.#layoutModel.id);
        this.#layoutModel.widgets?.forEach(function(widgetModel){
            let widget = new IeecloudWidgetRenderer(widgetModel, scope.#node);
            widget.render(containerElement)
        });
    }
}