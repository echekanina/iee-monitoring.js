import IeecloudWidgetActionsRenderer from "./IeecloudWidgetActionsRenderer.js";

export default class IeecloudWidgetActionsController {
    #widgetBodyController;
    #actionList;

    constructor(widgetBodyController, actionList) {
        this.#widgetBodyController = widgetBodyController;
        this.#actionList = actionList;
    }

    init(containerId) {
        let scope = this;

        this.#updateActionListState();

        const ieecloudWidgetActionsRenderer = new IeecloudWidgetActionsRenderer(containerId, this.#actionList);
        ieecloudWidgetActionsRenderer.render();

        ieecloudWidgetActionsRenderer.addEventListener('IeecloudWidgetActionsRenderer.selectItem', function (event) {
            const item = event.value;
            scope.#widgetBodyController.switchView(item.view, item.model, item.map);
            scope.#updateActionListState();
            ieecloudWidgetActionsRenderer.layoutModel = scope.#actionList;
            ieecloudWidgetActionsRenderer.redraw();
        });
    }

    #updateActionListState() {
        let scope = this;
        this.#actionList.forEach(function (item) {

            if (item.hasOwnProperty('model')) {
                item.active = item.model === scope.#widgetBodyController?.modelData;
            }

            if (item.hasOwnProperty('view')) {
                item.active = item.view === scope.#widgetBodyController?.viewType;
            }

            if (item.hasOwnProperty('map')) {
                item.active = item.map === scope.#widgetBodyController?.mapType;
            }
        });
    }
}