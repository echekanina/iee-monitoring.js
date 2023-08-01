import EventDispatcher from "../../../../../../../main/events/EventDispatcher.js";

export default class IeecloudWidgetBodyRenderer extends EventDispatcher{
    #layoutModel;
    #node;
    #container;

    constructor(containerId, layoutModel, node) {
        super();
        this.#layoutModel = layoutModel;
        this.#node = node;
        this.#container = document.querySelector("#" + containerId);
    }

    generateTemplate() {
        return ` <div  class="widget-body-content" id="widget-body-` + this.#layoutModel.id + `">
                                    </div>`;
    }

    render() {
        this.#container.innerHTML = '';
        const widgetBodyTemplate = this.generateTemplate();
        this.#container.insertAdjacentHTML('beforeend', widgetBodyTemplate);
    }

    destroy() {
        const bodyContainerElement = document.querySelector("#widget-body-" + this.#layoutModel.id);
        if (bodyContainerElement) {
            bodyContainerElement.innerHTML = '';
        }
    }
}