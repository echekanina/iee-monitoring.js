import IeecloudTopBarRenderer from "../topbar-renderer/IeecloudTopBarRenderer.js";
import {IeecloudSearchBlockController} from "../search-block/IeecloudSearchBlockController.js";

export default class IeecloudTopBarController {
    #systemController;

    constructor(systemController) {
        this.#systemController = systemController;
    }

    init(containerId, userProfile, loginController) {
        const scope = this;
        const renderer = new IeecloudTopBarRenderer(containerId);
        const activeNode = this.#systemController.getActiveNode();
        renderer.render(activeNode, this.#systemController.getTreeModel(), userProfile);

        renderer.addEventListener('IeecloudTopBarRenderer.logout', function (event) {
            loginController.logout();
        });

        let searchBlockController = new IeecloudSearchBlockController(scope.#systemController);
        searchBlockController.init(renderer.searchBlockLgContainerId, renderer.searchBlockSmContainerId);

    }
}