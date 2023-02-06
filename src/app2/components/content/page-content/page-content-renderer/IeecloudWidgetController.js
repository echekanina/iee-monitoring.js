import IeecloudWidgetRenderer from "./IeecloudWidgetRenderer.js";
import IeecloudWidgetBodyController from "./IeecloudWidgetBodyController.js";
import IeecloudWidgetActionsController from "./IeecloudWidgetActionsController.js";
import {eventBus} from "../../../../main/index.js";

export default class IeecloudWidgetController {
    #widgetModel;
    #systemController;
    #widgetBodyControllers = [];
    #widgetRenderer;

    constructor(widgetModel, systemController) {
        this.#widgetModel = widgetModel;
        this.#systemController = systemController;

    }

    init(containerId) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        scope.#widgetRenderer = new IeecloudWidgetRenderer(containerId, this.#widgetModel, activeNode);
        scope.#widgetRenderer.render();

        let widgetBodyController;
        if (this.#widgetModel.widgetContent) {
            widgetBodyController = new IeecloudWidgetBodyController(this.#widgetModel.widgetContent, this.#systemController);
            widgetBodyController.init(scope.#widgetRenderer.cardBodyContainer);
            scope.#widgetBodyControllers.push(widgetBodyController);
        }

        if (this.#widgetModel.viewActions) {
            const widgetHeaderActionsController = new IeecloudWidgetActionsController(widgetBodyController, this.#widgetModel.viewActions);
            widgetHeaderActionsController.init(scope.#widgetRenderer.viewActionsContainer);
        }

        if (this.#widgetModel.modelDataActions) {
            const widgetHeaderActionsController = new IeecloudWidgetActionsController(widgetBodyController, this.#widgetModel.modelDataActions);
            widgetHeaderActionsController.init(scope.#widgetRenderer.modelDataActionsContainer);
        }

        if (this.#widgetModel.mapViewActions) {
            const widgetHeaderActionsController = new IeecloudWidgetActionsController(widgetBodyController, this.#widgetModel.mapViewActions);
            widgetHeaderActionsController.init(scope.#widgetRenderer.viewMapActionsContainer);
        }

        eventBus.on('IeecloudWidgetActionsController.viewChanged', this.#toggleBtnGroupListener);
    }

    #toggleBtnGroupListener = (viewType) => {
        const scope = this;
        scope.#widgetRenderer.toggleBtnGroup(scope.#widgetRenderer.viewMapActionsBtnId, viewType === 'map');
        scope.#widgetRenderer.toggleBtnGroup(scope.#widgetRenderer.viewModelActionsBtnId,  (viewType === 'viewer-3d' || viewType === 'viewer-2d'));
    };

    destroy(){
        const scope = this;
        scope.#widgetBodyControllers.forEach(function (controller) {
            controller.destroy();
        });

        scope.#widgetRenderer.destroy();
        eventBus.removeListener('IeecloudWidgetActionsController.viewChanged', this.#toggleBtnGroupListener);
    }

}