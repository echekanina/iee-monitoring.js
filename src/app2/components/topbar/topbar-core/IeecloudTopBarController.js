import IeecloudTopBarRenderer from "../topbar-renderer/IeecloudTopBarRenderer.js";
import {eventBus} from "../../../main/index.js";

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

        renderer.addEventListener('IeecloudTopBarRenderer.searchNode', function (event) {
            const searchText = event.value;
            if (scope.#systemController["childSystemController"]) {
                const nodes = scope.#systemController["childSystemController"].searchNode(searchText);
                renderer.drawAutoComplete(nodes);
            }
        });

        renderer.addEventListener('IeecloudTopBarRenderer.setActiveNode', function (event) {
            const nodeId = event.value;
            if (nodeId) {
                eventBus.emit('IeecloudTopBarController.itemClicked', nodeId, false);
            }
        });

        scope.#systemController.on('tree.activeNodeSet', function (node) {
            const activeNode = scope.#systemController.getActiveNode();
            renderer.redrawSearch(activeNode);
        });

    }
}