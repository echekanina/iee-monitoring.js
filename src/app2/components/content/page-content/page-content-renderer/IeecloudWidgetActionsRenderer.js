export default class IeecloudWidgetActionsRenderer {
    #layoutModel;
    #widgetBody;
    #container;

    constructor(widgetBody, layoutModel) {

        this.#widgetBody = widgetBody;
        this.#layoutModel = layoutModel;
    }

    generateTemplate() {
        const scope = this;
        let template = ``
        this.#layoutModel.forEach(function (item) {
            template = template + `<li><a class="dropdown-item ${(scope.#widgetBody.viewType && scope.#widgetBody.viewType === item.view) || (scope.#widgetBody.modelData && scope.#widgetBody.modelData === item.model) ? "active" : ""}" id="widget-action-` + item.id + `" href="#">` + item.name + `</a></li>`
        })
        return template;
    }

    render(container) {
        container.insertAdjacentHTML('beforeend', this.generateTemplate());
        this.#container = container;
        this.#addEventListeners();
    }

    #redraw() {
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
            scope.#widgetBody.switchView(item.view, item.model);
            scope.#redraw();
        };
    }

    #removeEventListeners() {
        const scope = this;
        scope.#layoutModel.forEach(function (item) {
            const widgetActionItem = document.querySelector("#widget-action-" + item.id);
            widgetActionItem?.removeEventListener('click', scope.#switchViewListener(item));
        });
    }
}