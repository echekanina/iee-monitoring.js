import IeecloudTopBarRenderer from "../topbar-renderer/IeecloudTopBarRenderer.js";
import {IeecloudSearchBlockController} from "../search-block/IeecloudSearchBlockController.js";

export default class IeecloudTopBarController {
    #systemController;

    constructor(systemController) {
        this.#systemController = systemController;
    }

    init(containerId) {
        const scope = this;
        const renderer = new IeecloudTopBarRenderer(containerId);
        const activeNode = this.#systemController.getActiveNode();
        renderer.render(activeNode, this.#systemController.getTreeModel());

        let searchBlockController = new IeecloudSearchBlockController(scope.#systemController);
        searchBlockController.init(renderer.searchBlockLgContainerId, renderer.searchBlockSmContainerId);

    }
}