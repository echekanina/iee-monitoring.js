import IeecloudPageContentRenderer from "../page-content-renderer/IeecloudPageContentRenderer.js";

export default class IeecloudPageContentController {
    #systemController;
    constructor(systemController) {
        this.#systemController = systemController;
    }


    init(pageContentContainerId) {
        const pageContentRenderer = new IeecloudPageContentRenderer(this.#systemController.getActiveNode(), pageContentContainerId);
        pageContentRenderer.render();

    }
}