import IeecloudTreeLightRenderer from "../tree-renderer/IeecloudTreeLightRenderer.js";

export default class IeecloudTreeLightController {
    #systemController;
    #schemeModel;
    #treeRenderer;
    #treeSettings;

    constructor(systemController, schemeModel, treeSettings) {
        this.#systemController = systemController;
        this.#schemeModel = schemeModel;
        this.#treeSettings = treeSettings;
    }


    init(treeName, containerId) {
        const scope = this;

        scope.#treeRenderer = new IeecloudTreeLightRenderer(treeName, containerId);
        scope.#treeRenderer.render();

        scope.#treeRenderer?.addEventListener('IeecloudTreeLightRenderer.setActiveNode', function (event) {
            const item = event.value;
            scope.#goToNewStateById(item.id)
        });

        scope.#treeRenderer?.addEventListener('IeecloudTreeLightRenderer.searchNode', function (event) {
            const searchText = event.value;
            scope.#systemController.searchNodeAndRedrawTree(searchText);
        });

        scope.#systemController.on('tree.redrawTree', function (tree) {
            scope.#treeRenderer?.redrawTree(tree);
            scope.#applyTreeSettings();
        });


    }

    #isExpandedSchemeNodeInSettings() {
        const scope = this;
        return !(!scope.#treeSettings.expandedNodeScheme || scope.#treeSettings.expandedNodeScheme.trim().length === 0);
    }

    #applyTreeSettings() {
        let scope = this;

        if (scope.#isExpandedSchemeNodeInSettings()) {
            scope.#treeRenderer.expandTreeByNodeScheme(scope.#treeSettings?.expandedNodeScheme);
        }
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