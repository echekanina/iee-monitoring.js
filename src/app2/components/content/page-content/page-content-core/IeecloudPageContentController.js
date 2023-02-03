import IeecloudPageContentRenderer from "../page-content-renderer/IeecloudPageContentRenderer.js";
import IeecloudWidgetRowController from "../page-content-renderer/IeecloudWidgetRowController.js";
import {eventBus} from "../../../../main/index.js";
import {cloneDeep} from "lodash-es";


export default class IeecloudPageContentController {
    #systemController;
    #pageContentRenderer;
    #layoutModel;

    #widgetsRowMapControllers = {};

    constructor(systemController, layout) {
        this.#systemController = systemController;
        this.#layoutModel = cloneDeep(layout);
    }


    init(pageContentContainerId) {
        const scope = this;

        scope.#pageContentRenderer = new IeecloudPageContentRenderer();
        this.buildPageContent(pageContentContainerId);

        eventBus.on('IeecloudContentOptionsController.layoutChanged', function (layout) {
            scope.#layoutModel = cloneDeep(layout);
        });
    }

    buildPageContent(pageContentContainerId) {
        const scope = this;

        let activeNode = this.#systemController.getActiveNode();

        let layoutModel = this.#layoutModel[activeNode.schemeId];

        scope.#pageContentRenderer.render(activeNode, pageContentContainerId);


        if (layoutModel?.widgetRows && layoutModel.widgetRows.length > 0) {
            layoutModel.widgetRows.forEach(function (rowModel) {
                let widgetRowController = new IeecloudWidgetRowController(rowModel, scope.#systemController);
                widgetRowController.init(scope.#pageContentRenderer.widgetContainerId);
                if (!scope.#widgetsRowMapControllers.hasOwnProperty(activeNode.id)) {
                    scope.#widgetsRowMapControllers[activeNode.id] = [];
                }
                scope.#widgetsRowMapControllers[activeNode.id].push(widgetRowController);
            });
        }
    }

    destroy() {
        const scope = this;
        for (let key in scope.#widgetsRowMapControllers) {
            scope.#widgetsRowMapControllers[key].forEach(function (controller) {
                controller.destroy();
            });
        }
        scope.#widgetsRowMapControllers = {};
    }

    isDestroyed(nodeId) {
        return !this.#widgetsRowMapControllers[nodeId]
    }

    destroyNode(nodeId) {
        const scope = this;
        if (scope.#widgetsRowMapControllers.hasOwnProperty(nodeId)) {
            scope.#widgetsRowMapControllers[nodeId].forEach(function (controller) {
                controller.destroy();
            });

            delete scope.#widgetsRowMapControllers[nodeId];
        }
    }
}