import IeecloudPageContentRenderer from "../page-content-renderer/IeecloudPageContentRenderer.js";

export default class IeecloudPageContentController {
    #systemController;
    constructor(systemController) {
        this.#systemController = systemController;
    }


    init(activeNode, pageContentContainerId) {
        const pageContentRenderer = new IeecloudPageContentRenderer(activeNode, pageContentContainerId);
        pageContentRenderer.render();

    }
}