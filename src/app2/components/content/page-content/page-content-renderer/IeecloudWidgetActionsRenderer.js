export default class IeecloudWidgetActionsRenderer {
    #layoutModel;
    #widgetBody;

    constructor(widgetBody, layoutModel) {

        this.#widgetBody = widgetBody;
        this.#layoutModel = layoutModel;
    }

    generateTemplate() {
        let template = ``
        this.#layoutModel.forEach(function (item) {
            template = template + `<li><a class="dropdown-item" id="widget-action-` + item.id + `" href="#">` + item.name + `</a></li>`
        })
        return template;
    }

    render(container) {
        container.insertAdjacentHTML('beforeend', this.generateTemplate());
        this.#addEventListeners();
    }


    #addEventListeners() {
        const scope = this;
        this.#layoutModel.forEach(function (item) {
            const widgetActionItem = document.querySelector("#widget-action-" + item.id);
            widgetActionItem?.addEventListener('click', function (event) {
                scope.#widgetBody.switchView(item.value, item.params);
            });
        });
    }
}