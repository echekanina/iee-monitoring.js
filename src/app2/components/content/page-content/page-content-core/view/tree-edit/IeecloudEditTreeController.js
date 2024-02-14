import IeecloudEditTreeService from "./IeecloudEditTreeService.js";
import IeecloudEditTreeRenderer from "../../../page-content-renderer/view/tree-edit/IeecloudEditTreeRenderer.js";
import {IeecloudTreeInspireImpl} from "ieecloud-tree";

export default class IeecloudEditTreeController {
    #systemController;
    #renderer;
    #treeEditSystemController;
    #editTreeService;

    constructor(systemController) {
        this.#systemController = systemController
    }

    init(container) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        this.#renderer = new IeecloudEditTreeRenderer(activeNode);
        this.#renderer.render(container);

        scope.#editTreeService = new IeecloudEditTreeService(import.meta.env.APP_SERVER_URL);
        // TODO: remove hardcode module code
        scope.#editTreeService.getTreeScheme("state_object/" + import.meta.env.VITE_APP_MODULE_CONTENT_SCHEMA, function (schemeModel) {
            scope.#editTreeService.getTreeData("state_object/" + import.meta.env.VITE_APP_MODULE_CONTENT_MODEL, schemeModel, function (treeData) {
                scope.#treeEditSystemController = new IeecloudTreeInspireImpl();
                scope.#treeEditSystemController.createTree(treeData);

                scope.#treeEditSystemController.on('tree.redrawTree', function (tree) {
                    scope.#renderer.renderTree(tree);
                });
            });
        });

        scope.#renderer.addEventListener('IeecloudEditTreeRenderer.createNode', function (event) {
            const data = event.value;
            scope.#treeEditSystemController.createNode(data.properties, data.scheme, data.parentNode);
            scope.#renderer.hideModal();
        });

        scope.#renderer.addEventListener('IeecloudEditTreeRenderer.deleteNodeById', function (event) {
            const nodeId = event.value;
            scope.#treeEditSystemController.deleteNodeById(nodeId)
        });


        scope.#renderer.addEventListener('IeecloudEditTreeRenderer.editNodeById', function (event) {
            const nodeId = event.value;
            let editNodeData =  scope.#treeEditSystemController.getEditNodeData(nodeId);
            if (editNodeData) {
                scope.#renderer.doEditNode(editNodeData.nodeId, editNodeData.propertiesData);
            }
        });


        scope.#renderer.addEventListener('IeecloudEditTreeRenderer.updateNode', function (event) {
            const data = event.value;
            scope.#treeEditSystemController.updateNode(data.nodeId, data.properties);
            scope.#renderer.hideModal();
        });



        scope.#renderer.addEventListener('IeecloudEditTreeRenderer.renameNode', function (event) {
            const node = event.value;
            scope.#treeEditSystemController.renameNode(node.id, node.text);
        });

        scope.#renderer.addEventListener('IeecloudEditTreeRenderer.schemeSelected', function (event) {
            const schemeFileName = event.value;
            scope.#editTreeService.getTreeScheme('../' + schemeFileName, function (schemeModel) {

                scope.#treeEditSystemController = new IeecloudTreeInspireImpl();

                scope.#treeEditSystemController.on('tree.redrawTree', function (tree) {
                    scope.#renderer.renderTree(tree);
                });
                const selectedNodeScheme = schemeModel.rootElements[0];
                scope.#renderer.createDefaultNode(selectedNodeScheme);

            });
        });

        scope.#renderer.addEventListener('IeecloudEditTreeRenderer.createDefaultNode', function (event) {
            const value = event.value;
            if(value.properties.tree_name){
                scope.#treeEditSystemController.setName(value.properties.tree_name);
                delete value.properties.tree_name

            }
            scope.#treeEditSystemController.createNode(value.properties, value.selectedNodeScheme);
            scope.#renderer.hideModal();

        });
    }

    saveEditedData() {
        const scope = this;
        const treeModel = scope.#treeEditSystemController.getTreeModel();
        scope.#editTreeService.saveTree(treeModel, import.meta.env.VITE_CONTENT_MODEL_FILE_NAME);

    }

    destroy(){
        // do not implement yet
    }

    createNewTree(){
        const scope = this;
        scope.#editTreeService.getSchemas(function (schemes) {
            scope.#renderer.showSchemas(schemes);
        });
    }

}