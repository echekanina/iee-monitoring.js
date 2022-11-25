import IeecloudTopBarRenderer from "../topbar-renderer/IeecloudTopBarRenderer.js";

export default class IeecloudTopBarController {
    #systemController;

    constructor(systemController) {
        this.#systemController = systemController;
    }

    init(containerId) {
        const renderer = new IeecloudTopBarRenderer(containerId);
        renderer.render(this.#systemController.getTreeModel());
    }
}