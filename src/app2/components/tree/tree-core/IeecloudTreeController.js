import IeecloudTreeRenderer from "../tree-renderer/IeecloudTreeRenderer.js";

export default class IeecloudTreeController {
    #systemController;

    constructor(systemController) {
        this.#systemController = systemController;

    }


    init(containerId) {
        const scope = this;
        const treeRenderer = new IeecloudTreeRenderer(containerId);
        treeRenderer.render();


        treeRenderer.addEventListener('IeecloudTreeRenderer.setActiveNode', function (event) {
            const item = event.value;
            scope.#systemController.setActiveNode(item.id);
            // const activeNode = scope.#systemController.getActiveNode();
            // sideBarRenderer.redraw(activeNode);

        });

        scope.#systemController.on('tree.redrawTree', function (tree) {
            treeRenderer.redrawTree(tree);

        });


    }
}