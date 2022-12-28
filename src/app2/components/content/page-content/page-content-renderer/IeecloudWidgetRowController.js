import IeecloudWidgetRowRenderer from "./IeecloudWidgetRowRenderer.js";
import IeecloudWidgetController from "./IeecloudWidgetController.js";

export default class IeecloudWidgetRowController {
    #systemController;
    #rowModel;

    constructor(rowModel, systemController) {
        this.#rowModel = rowModel;
        this.#systemController = systemController;
    }

    init(containerId) {
        let scope = this;
        let activeNode = this.#systemController.getActiveNode();
        let widgetRow = new IeecloudWidgetRowRenderer(containerId, this.#rowModel, activeNode);
        widgetRow.render();

        this.#rowModel.widgets?.forEach(function (widgetModel) {
            let widgetController = new IeecloudWidgetController(widgetModel, scope.#systemController);
            widgetController.init(widgetRow.rowWidgetsContainer)
        });
    }

}