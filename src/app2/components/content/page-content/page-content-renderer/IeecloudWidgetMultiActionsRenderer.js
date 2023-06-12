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
            // let clazz = item.active ? "active" : ""
            // template = template + `<li><a class="dropdown-item ${clazz}" id="widget-action-` + item.id + `" href="#">` + item.name + `</a></li>`

            template = template + `<li>
                <a class="dropdown-item" href="#">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="widget-multi-action-` + item.id + `"/>
                        <label class="form-check-label" htmlFor="widget-multi-action-` + item.id + `">` + item.name + `</label>
                    </div>
                </a>
            </li>`

            // template = template +  `<li> <label>
            //     <input type="checkbox" id="widget-multi-action-` + item.id + `"> ` + item.name + `
            // </label> </li>`

        })


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
        console.log("#switchViewListener(item)", item)
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