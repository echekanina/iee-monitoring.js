import IeecloudDummyRenderer from "../../../page-content-renderer/view/dummy/IeecloudDummyRenderer.js";

export default class IeecloudDummyController {
    #renderer;
    #systemController;

    constructor(systemController) {
        this.#systemController = systemController;
    }

    init(container) {
        let activeNode = this.#systemController.getActiveNode();
        this.#renderer = new IeecloudDummyRenderer(activeNode);
        this.#renderer.render(container);
    }

}