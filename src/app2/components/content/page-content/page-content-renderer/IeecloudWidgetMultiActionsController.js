import IeecloudWidgetMultiActionsRenderer from "./IeecloudWidgetMultiActionsRenderer.js";

export default class IeecloudWidgetMultiActionsController {
    #widgetBodyController;
    #actionList;

    constructor(widgetBodyController, actionList) {
        this.#widgetBodyController = widgetBodyController;
        this.#actionList = actionList;
    }

    init(containerId) {
        let scope = this;

        this.#updateMultiActionListState();

        const ieecloudWidgetMultiActionsRenderer = new IeecloudWidgetMultiActionsRenderer(containerId, this.#actionList);
        ieecloudWidgetMultiActionsRenderer.render();

        ieecloudWidgetMultiActionsRenderer.addEventListener('IeecloudWidgetMultiActionsRenderer.selectItem', function (event) {
            const item = event.value.item;
            scope.#widgetBodyController.switchView(item.view, item.model, item.map, event.value);
            scope.#updateMultiActionListState();
        });
    }

    #updateMultiActionListState() {
        let scope = this;
        this.#actionList.forEach(function (item) {
            if (item.hasOwnProperty('event')) {
                item.active = item.event === scope.#widgetBodyController?.storeEventType;
            }
        });
    }
}