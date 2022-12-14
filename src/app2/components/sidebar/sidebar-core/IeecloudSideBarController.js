import IeecloudSideBarRenderer from "../sidebar-renderer/IeecloudSideBarRenderer.js";
import {eventBus} from "../../../main/index.js";
import IeecloudContentService from "../../content/content-core/IeecloudContentService.js";
import {IeecloudMyTreeInspireView, IeecloudTreeInspireImpl} from "ieecloud-tree";
import IeecloudContentController from "../../content/content-core/IeecloudContentController.js";

import './styles/assets/model-tree.css';

export default class IeecloudSideBarController {
    #systemController;
    #schemeModel;
    #DEFAULT_ACTIVE_MODULE_ID = "9bd49c90-4939-4805-a7ec-b207c727b907"; // TODO in properties
    constructor(schemeModel, systemController) {
        this.#schemeModel = schemeModel;
        this.#systemController = systemController;
    }

    init(containerId, contentContainerId) {
        const scope = this;
        // workaround
        this.#systemController.setActiveNode(this.#DEFAULT_ACTIVE_MODULE_ID);

        const activeNode = this.#systemController.getActiveNode();

        const sideBarRenderer = new IeecloudSideBarRenderer(containerId);
        sideBarRenderer.render(activeNode, this.#systemController.getTreeModel());

        if (activeNode) {
            scope.#loadSystemModel(activeNode, contentContainerId);
        }

        sideBarRenderer.addEventListener('IeecloudSideBarRenderer.itemClicked', function (event) {
            const item = event.value;
            scope.#systemController.setActiveNode(item.id);
            const activeNode = scope.#systemController.getActiveNode();
            sideBarRenderer.redraw(activeNode);
            scope.#loadSystemModel(activeNode, contentContainerId);
        });
    }

    #loadSystemModel(node, contentContainerId) {
        const scope = this;
        eventBus.removeAllListeners();
        if (node.id === scope.#DEFAULT_ACTIVE_MODULE_ID) {
            // const containerService = new IeecloudContentService('http://127.0.0.1:3001');
            const containerService = new IeecloudContentService('http://notebook.ieecloud.com:8080/monitor_izhora_storage/mocks/');
            containerService.getContentScheme('content-scheme.json', function (schemeModel) {

                containerService.getContentData('tree-model-2022-12-08_17_14_38_173.json', function (treeData) {

                    const systemController = new IeecloudTreeInspireImpl();
                    systemController.createTree(treeData);

                    const viewTreeInstance = scope.#createTreeView();

                    viewTreeInstance.on('treeView.setActiveNode', function (node) {
                        systemController.setActiveNode(node.id);

                    });

                    const contentController = new IeecloudContentController(schemeModel, systemController);
                    contentController.init(contentContainerId);

                    systemController.on('tree.redrawTree', function (tree) {
                        viewTreeInstance.redrawTreeView(tree);

                    });
                });
            });
        } else {
            const container = document.querySelector("#" + contentContainerId);
            if (container) {
                document.querySelector("#" + contentContainerId).innerHTML = '';
            }

        }
    }

    #createTreeView() {
        return new IeecloudMyTreeInspireView('inspire-tree',
            null, {readOnly: true});

    }

    get DEFAULT_ACTIVE_MODULE_ID (){
        return this.#DEFAULT_ACTIVE_MODULE_ID
    }
}