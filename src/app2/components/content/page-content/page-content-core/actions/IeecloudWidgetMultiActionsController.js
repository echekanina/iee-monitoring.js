import IeecloudWidgetMultiActionsRenderer
    from "../../page-content-renderer/actions/IeecloudWidgetMultiActionsRenderer.js";

export default class IeecloudWidgetMultiActionsController {
    #widgetBodyController;
    #actionList;
    #renderer;

    constructor(widgetBodyController, actionList) {
        this.#widgetBodyController = widgetBodyController;
        this.#actionList = actionList;
    }

    init(containerId) {
        let scope = this;

        this.#updateMultiActionListState();

        scope.#renderer = new IeecloudWidgetMultiActionsRenderer(containerId, this.#actionList);
        scope.#renderer.render();

        scope.#renderer.addEventListener('IeecloudWidgetMultiActionsRenderer.selectItem', function (event) {
            const item = event.value.item;
            scope.#widgetBodyController.switchView(item.view, item.model, item.map, event.value);
            scope.#updateMultiActionListState();
        });
    }

    #updateMultiActionListState() {
        let scope = this;
        this.#actionList.forEach(function (item) {
            if (item.hasOwnProperty('store')) {
                if(Array.isArray(scope.#widgetBodyController?.storeType)){
                    const names = scope.#widgetBodyController?.storeType.map(function(element) {
                        return element['name'];
                    });
                    item.active = Array.isArray(scope.#widgetBodyController?.storeType) && names.includes(item.name);
                }
            }
        });
    }

    destroy() {
        let scope = this;
        scope.#renderer.destroy();
    }
}