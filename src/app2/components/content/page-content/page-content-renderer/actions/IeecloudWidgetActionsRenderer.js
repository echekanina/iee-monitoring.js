import EventDispatcher from "../../../../../main/events/EventDispatcher.js";


export default class IeecloudWidgetActionsRenderer extends EventDispatcher {
    #layoutModel;
    #container;
    #node;

    constructor(containerId, layoutModel, node) {
        super();
        this.#container = document.querySelector("#" + containerId);
        this.#layoutModel = layoutModel;
        this.#node = node;
    }

    generateTemplate() {
        const scope = this;
        let template = ``
        this.#layoutModel.forEach(function (item) {
            if (item.hasOwnProperty('view') && item.view === 'editMode' && !scope.#node.properties.editMode) {
                return;
            }
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