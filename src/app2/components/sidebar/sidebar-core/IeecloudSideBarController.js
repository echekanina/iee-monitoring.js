import IeecloudSideBarRenderer from "../sidebar-renderer/IeecloudSideBarRenderer.js";
import {eventBus} from "../../../main/index.js";
import IeecloudContentService from "../../content/content-core/IeecloudContentService.js";
import {IeecloudTreeInspireImpl} from "ieecloud-tree";
import IeecloudContentController from "../../content/content-core/IeecloudContentController.js";
import IeecloudTreeController from "../../tree/tree-core/IeecloudTreeController.js";

export default class IeecloudSideBarController {
    #systemController;
    #schemeModel;
    #DEFAULT_ACTIVE_MODULE_ID = "9bd49c90-4939-4805-a7ec-b207c727b907"; // TODO in properties
    constructor(schemeModel, systemController) {
        this.#schemeModel = schemeModel;
        this.#systemController = systemController;
    }

    init(containerId, contentContainerId, treeContainerId) {
        const scope = this;
        // workaround
        this.#systemController.setActiveNode(this.#DEFAULT_ACTIVE_MODULE_ID);

        const activeNode = this.#systemController.getActiveNode();

        const sideBarRenderer = new IeecloudSideBarRenderer(containerId);
        sideBarRenderer.render(activeNode, this.#systemController.getTreeModel());

        if (activeNode) {
            scope.#loadSystemModel(activeNode, contentContainerId, treeContainerId);
        }

        sideBarRenderer.addEventListener('IeecloudSideBarRenderer.itemClicked', function (event) {
            const item = event.value;
            scope.#systemController.setActiveNode(item.id);
            const activeNode = scope.#systemController.getActiveNode();
            sideBarRenderer.redraw(activeNode);
            scope.#loadSystemModel(activeNode, contentContainerId, treeContainerId);
        });
    }

    #loadSystemModel(node, contentContainerId, treeContainerId) {
        const scope = this;
        eventBus.removeAllListeners();

        // TODO: refactor
        const wrapper = document.querySelector("#wrapper");
        wrapper?.classList.remove("sidenav-toggled");

        if (node.id === scope.#DEFAULT_ACTIVE_MODULE_ID) {
            const containerService = new IeecloudContentService('http://127.0.0.1:3001');
            // const containerService = new IeecloudContentService('http://notebook.ieecloud.com:8080/monitor_izhora_storage/mocks/');
            containerService.getContentScheme('content-scheme.json', function (schemeModel) {

                // containerService.getContentData('tree-model-2022-12-08_17_14_38_174.json', function (treeData) {
                containerService.getContentData('tree-model-2022-12-08_17_14_38_173_v4_dev.json', function (treeData) {

                    const systemController = new IeecloudTreeInspireImpl();
                    systemController.createTree(treeData);

                    const treeController = new IeecloudTreeController(systemController);
                    treeController.init(treeContainerId);

                    const contentController = new IeecloudContentController(schemeModel, systemController);
                    contentController.init(contentContainerId);

                    scope.#systemController["childSystemController"] = systemController;

                });
            });


        } else {
            let container = document.querySelector("#" + contentContainerId);
            if (container) {
                document.querySelector("#" + contentContainerId).innerHTML = '';
            }

           container = document.querySelector("#" + treeContainerId);
            if (container) {
                document.querySelector("#" + treeContainerId).innerHTML = '';
            }

            const wrapper = document.querySelector("#wrapper");
            wrapper?.classList.remove("tree-toggled");

            scope.#systemController["childSystemController"] = null;

        }
    }

    get DEFAULT_ACTIVE_MODULE_ID (){
        return this.#DEFAULT_ACTIVE_MODULE_ID
    }
}