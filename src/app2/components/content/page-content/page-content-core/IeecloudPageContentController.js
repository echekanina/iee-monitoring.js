import IeecloudPageContentRenderer from "../page-content-renderer/IeecloudPageContentRenderer.js";

export default class IeecloudPageContentController {
    #systemController;
    constructor(systemController) {
        this.#systemController = systemController;
    }


    init(pageContentContainerId) {
        const scope = this;
        const pageContentRenderer = new IeecloudPageContentRenderer(pageContentContainerId);
        pageContentRenderer.render(this.#systemController.getActiveNode());

        this.#systemController.on('tree.activeNodeSet', function (node) {
            pageContentRenderer.render(scope.#systemController.getActiveNode());
        });

    }
}