import EventDispatcher from "../../../../../main/events/EventDispatcher.js";


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
            let attr = item.active ? "checked" : ""
            template = template + `<li>
                <a class="dropdown-item" href="#">
                    <div class="form-check" id="form-check-`+item.id + `">
                        <input class="form-check-input" type="checkbox"  style="cursor: pointer;" ${attr} value="" id="widget-multi-action-` + item.id + `"/>
                        <label class="form-check-label" htmlFor="widget-multi-action-` + item.id + `" style="cursor: pointer;">` + item.name + `</label>
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
            const widgetActionItem = document.getElementById("widget-multi-action-" + item.id);
            widgetActionItem?.addEventListener('change', scope.#switchViewListener(item));

            const formCheckItem= document.getElementById("form-check-" + item.id);
            formCheckItem?.addEventListener('click',  scope.#formCheckClickListener(item));

        });
    }

    #switchViewListener(item) {
        const scope = this;
        return function (event) {
            event.stopPropagation();
            const isChecked = event.currentTarget.checked;
            scope.dispatchEvent({
                type: 'IeecloudWidgetMultiActionsRenderer.selectItem',
                value: {item: item, isChecked: isChecked}
            });
        };
    }


    #formCheckClickListener(item) {

        return function (event) {
            if (event.target.id === "widget-multi-action-" + item.id) {
                event.stopPropagation();
                return false;
            }
            const widgetActionItem = document.getElementById("widget-multi-action-" + item.id);
            widgetActionItem.checked = !widgetActionItem.checked;
            let chaneEvent = new Event('change');
            widgetActionItem.dispatchEvent(chaneEvent);
        };
    }

    #removeEventListeners() {
        const scope = this;
        scope.#layoutModel.forEach(function (item) {

            const formCheckItem= document.getElementById("form-check-" + item.id);
            formCheckItem?.removeEventListener('click',  scope.#formCheckClickListener(item));

            const widgetActionItem = document.querySelector("#widget-multi-action-" + item.id);
            widgetActionItem?.removeEventListener('change', scope.#switchViewListener(item));
        });
    }

    destroy() {
        let scope = this;
        scope.#removeEventListeners();
    }

    set layoutModel(model) {
        this.#layoutModel = model;
    }
}