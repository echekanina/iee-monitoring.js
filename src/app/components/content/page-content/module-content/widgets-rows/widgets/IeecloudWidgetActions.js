export default class IeecloudWidgetActions {
    layoutModel;
    observableObject;
    #template = ``;
    #widgetBodyId;

    constructor(widgetBodyId, layoutModel, observableObject) {

        this.#widgetBodyId = widgetBodyId;
        this.layoutModel = layoutModel;
        this.observableObject = observableObject;
    }

    generateTemplate() {
        const scope = this;
        this.layoutModel.forEach(function(item){
            scope.#template = scope.#template + `<li><a class="dropdown-item" id="widget-action-` + item.id + `" href="#">` + item.name + `</a></li>`
        })
        return scope.#template;
    }

    insertTemplates() {
        const scope = this;
        this.layoutModel.forEach(function(item){
            const widgetActionItem = document.querySelector("#widget-action-" + item.id);

            widgetActionItem?.addEventListener('click', function (event) {
                scope.observableObject.emit('IeecloudWidgetActions.click', {type: item.value, bodyId : scope.#widgetBodyId, params:item.params}, false);

            });
        });

    }
}