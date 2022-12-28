import EventDispatcher from "../../../../main/events/EventDispatcher.js";

export default class IeecloudWidgetActionsRenderer extends EventDispatcher {
    #layoutModel;
    #container;

    constructor(containerId, layoutModel) {
        super();
        this.#container = document.querySelector("#" + containerId);
        this.#layoutModel = layoutModel;
    }

    generateTemplate() {
        let template = ``
        this.#layoutModel.forEach(function (item) {
            let clazz = item.active ? "active" : ""
            template = template + `<li><a class="dropdown-item ${clazz}" id="widget-action-` + item.id + `" href="#">` + item.name + `</a></li>`
        })
        return template;
    }

    render() {
        this.#container?.insertAdjacentHTML('beforeend', this.generateTemplate());
        this.#addEventListeners();
    }

    redraw() {
        this.#removeEventListeners();
        this.#container.innerHTML = ''
        this.#container.insertAdjacentHTML('beforeend', this.generateTemplate());
        this.#addEventListeners();
    }


    #addEventListeners() {
        const scope = this;
        this.#layoutModel.forEach(function (item) {
            const widgetActionItem = document.querySelector("#widget-action-" + item.id);
            widgetActionItem?.addEventListener('click', scope.#switchViewListener(item));
        });
    }

    #switchViewListener(item) {
        const scope = this;
        return function (event) {
            scope.dispatchEvent({type: 'IeecloudWidgetActionsRenderer.selectItem', value: item});
        };
    }

    #removeEventListeners() {
        const scope = this;
        scope.#layoutModel.forEach(function (item) {
            const widgetActionItem = document.querySelector("#widget-action-" + item.id);
            widgetActionItem?.removeEventListener('click', scope.#switchViewListener(item));
        });
    }

    set layoutModel(model) {
        this.#layoutModel = model;
    }
}