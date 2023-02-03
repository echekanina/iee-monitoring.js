import IeecloudWidgetRenderer from "./IeecloudWidgetRenderer.js";
import IeecloudWidgetBodyController from "./IeecloudWidgetBodyController.js";
import IeecloudWidgetActionsController from "./IeecloudWidgetActionsController.js";

export default class IeecloudWidgetController {
    #widgetModel;
    #systemController;
    #widgetBodyControllers = [];

    constructor(widgetModel, systemController) {
        this.#widgetModel = widgetModel;
        this.#systemController = systemController;

    }

    init(containerId) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        let widgetRenderer = new IeecloudWidgetRenderer(containerId, this.#widgetModel, activeNode);
        widgetRenderer.render();

        let widgetBodyController;
        if (this.#widgetModel.widgetContent) {
            widgetBodyController = new IeecloudWidgetBodyController(this.#widgetModel.widgetContent, this.#systemController);
            widgetBodyController.init(widgetRenderer.cardBodyContainer);
            scope.#widgetBodyControllers.push(widgetBodyController);
        }

        if (this.#widgetModel.viewActions) {
            const widgetHeaderActionsController = new IeecloudWidgetActionsController(widgetBodyController, this.#widgetModel.viewActions);
            widgetHeaderActionsController.init(widgetRenderer.viewActionsContainer);
        }

        if (this.#widgetModel.modelDataActions) {
            const widgetHeaderActionsController = new IeecloudWidgetActionsController(widgetBodyController, this.#widgetModel.modelDataActions);
            widgetHeaderActionsController.init(widgetRenderer.modelDataActionsContainer);
        }
    }

    destroy(){
        const scope = this;
        scope.#widgetBodyControllers.forEach(function (controller) {
            controller.destroy();
        });

    }

}