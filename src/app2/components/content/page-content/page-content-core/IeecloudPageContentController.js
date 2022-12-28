import IeecloudPageContentRenderer from "../page-content-renderer/IeecloudPageContentRenderer.js";
import layout from "../page-content-renderer/content-layout.json";
import IeecloudWidgetRowController from "../page-content-renderer/IeecloudWidgetRowController.js";

export default class IeecloudPageContentController {
    #systemController;

    constructor(systemController) {
        this.#systemController = systemController;
    }


    init(pageContentContainerId) {
        const scope = this;
        const pageContentRenderer = new IeecloudPageContentRenderer(pageContentContainerId);
        this.#buildPageContent(pageContentRenderer);

        this.#systemController.on('tree.activeNodeSet', function (node) {
            scope.#buildPageContent(pageContentRenderer);
        });

    }

    #buildPageContent(pageContentRenderer) {
        const scope = this;

        let activeNode = this.#systemController.getActiveNode();

        pageContentRenderer.render(activeNode);

        let layoutModel = layout[activeNode.schemeId];

        if (layoutModel?.widgetRows && layoutModel.widgetRows.length > 0) {
            layoutModel.widgetRows.forEach(function (rowModel) {
                let widgetRowController = new IeecloudWidgetRowController(rowModel, scope.#systemController);
                widgetRowController.init(pageContentRenderer.widgetContainerId);
            });
        }
    }
}