import EventDispatcher from "../../../../main/events/EventDispatcher.js";


export default class IeecloudWidgetMultiActionsRenderer extends EventDispatcher {
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
            template = template + `<li>
                <a class="dropdown-item" href="#">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="widget-multi-action-` + item.id + `"/>
                        <label class="form-check-label" htmlFor="widget-multi-action-` + item.id + `">` + item.name + `</label>
                    </div>
                </a>
            </li>`
        });


        return template;
    }

    render() {
        this.#container?.insertAdjacentHTML('beforeend', this.generateTemplate());
        this.#addEventListeners();
    }


    #addEventListeners() {
        const scope = this;
        this.#layoutModel.forEach(function (item) {
            const widgetActionItem = document.querySelector("#widget-multi-action-" + item.id);
            widgetActionItem?.addEventListener('change', scope.#switchViewListener(item));
        });
    }

    #switchViewListener(item) {
        const scope = this;
        return function (event) {
            const isChecked = event.currentTarget.checked;
            scope.dispatchEvent({
                type: 'IeecloudWidgetMultiActionsRenderer.selectItem',
                value: {item: item, isChecked: isChecked}
            });
        };
    }

    #removeEventListeners() {
        const scope = this;
        scope.#layoutModel.forEach(function (item) {
            const widgetActionItem = document.querySelector("#widget-multi-action-" + item.id);
            widgetActionItem?.removeEventListener('change', scope.#switchViewListener(item));
        });
    }

    set layoutModel(model) {
        this.#layoutModel = model;
    }
}