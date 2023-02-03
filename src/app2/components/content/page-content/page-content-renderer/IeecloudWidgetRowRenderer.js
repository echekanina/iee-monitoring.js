export default class IeecloudWidgetRowRenderer {
    #layoutModel;
    #node;
    #container;
    #rowWidgetsContainer;

    constructor(containerId, layoutModel, node) {
        this.#layoutModel = layoutModel;
        this.#node = node;
        this.#container = document.querySelector("#" + containerId);
    }

    generateTemplate() {
        return `<div class="row" id="row-widgets-container-` + this.#layoutModel.id + `"></div>`;
    }

    render(){
        let widgetRowTemplate = this.generateTemplate();
        this.#container?.insertAdjacentHTML('beforeend', widgetRowTemplate);
        this.#rowWidgetsContainer = "row-widgets-container-" + this.#layoutModel.id;
    }

    destroy(){
        const rowWidgetsContainer = document.querySelector("#" +  this.#rowWidgetsContainer);
        rowWidgetsContainer?.remove();
    }

    get rowWidgetsContainer() {
        return this.#rowWidgetsContainer;
    }
}