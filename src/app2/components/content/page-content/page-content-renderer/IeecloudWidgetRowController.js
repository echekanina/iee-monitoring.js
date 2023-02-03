import IeecloudWidgetRowRenderer from "./IeecloudWidgetRowRenderer.js";
import IeecloudWidgetController from "./IeecloudWidgetController.js";

export default class IeecloudWidgetRowController {
    #systemController;
    #rowModel;
    #widgetControllers = [];
    #widgetRowRenderer;

    constructor(rowModel, systemController) {
        this.#rowModel = rowModel;
        this.#systemController = systemController;
    }

    init(containerId) {
        let scope = this;
        let activeNode = this.#systemController.getActiveNode();
        scope.#widgetRowRenderer = new IeecloudWidgetRowRenderer(containerId, this.#rowModel, activeNode);
        scope.#widgetRowRenderer.render();

        this.#rowModel.widgets?.forEach(function (widgetModel) {
            let widgetController = new IeecloudWidgetController(widgetModel, scope.#systemController);
            widgetController.init(scope.#widgetRowRenderer.rowWidgetsContainer);
            scope.#widgetControllers.push(widgetController);
        });
    }

    destroy() {
        let scope = this;

        scope.#widgetControllers.forEach(function (controller) {
            controller.destroy();
        });

        scope.#widgetRowRenderer.destroy();
        scope.#widgetControllers = [];
    }

}