import IeecloudWidgetRowRenderer from "../../page-content-renderer/row/IeecloudWidgetRowRenderer.js";
import IeecloudWidgetController from "./widget/IeecloudWidgetController.js";
import {accessControl} from "../../../../../main/index.js";

export default class IeecloudWidgetRowController {
    #systemController;
    #rowModel;
    #widgetControllers = [];
    #widgetRowRenderer;
    #prevUserWidgetSetting;

    constructor(rowModel, systemController, prevUserWidgetSetting) {
        this.#rowModel = rowModel;
        this.#systemController = systemController;
        this.#prevUserWidgetSetting = prevUserWidgetSetting;
    }

    init(containerId) {
        let scope = this;
        let activeNode = this.#systemController.getActiveNode();
        scope.#widgetRowRenderer = new IeecloudWidgetRowRenderer(containerId, this.#rowModel, activeNode);
        scope.#widgetRowRenderer.render();
        const accessMap = accessControl.getMappedUserAccess();
        this.#rowModel.widgets?.forEach(function (widgetModel) {
            if (accessMap && widgetModel.moduleAccess && accessMap[widgetModel.moduleAccess] === "none") {
                return false;
            }
            scope.#buildWidget(widgetModel);

        });
    }

    #buildWidget(widgetModel) {
        let scope = this;
        let widgetController = new IeecloudWidgetController(widgetModel, scope.#systemController);
        widgetController.init(scope.#widgetRowRenderer.rowWidgetsContainer,
            scope.#prevUserWidgetSetting ? scope.#prevUserWidgetSetting[widgetModel.id] : null);
        scope.#widgetControllers.push(widgetController);
    }

    get widgetControllers(){
        return this.#widgetControllers;
    }

    get rowModel(){
        return this.#rowModel;
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