import IeecloudTreeLightRenderer from "../tree-renderer/IeecloudTreeLightRenderer.js";

export default class IeecloudTreeLightController {
    #systemController;
    #schemeModel;
    #treeRenderer;

    constructor(systemController, schemeModel) {
        this.#systemController = systemController;
        this.#schemeModel = schemeModel;
    }


    init(treeName, containerId) {
        const scope = this;

        scope.#treeRenderer = new IeecloudTreeLightRenderer(treeName, containerId);
        scope.#treeRenderer.render();

        scope.#treeRenderer?.addEventListener('IeecloudTreeLightRenderer.setActiveNode', function (event) {
            const item = event.value;
            scope.#goToNewStateById(item.id)
        });

        scope.#systemController.on('tree.redrawTree', function (tree) {
            scope.#treeRenderer?.redrawTree(tree);
        });

    }

    #goToNewStateById(nodeId) {
        const scope = this;
        const newActiveNode = scope.#systemController.getNodeById(nodeId);
        const activeNode = this.#systemController.getActiveNode();
        if (newActiveNode && activeNode?.id !== newActiveNode.id) {
            this.#systemController.setActiveNode(newActiveNode.id);
        }

    }
}