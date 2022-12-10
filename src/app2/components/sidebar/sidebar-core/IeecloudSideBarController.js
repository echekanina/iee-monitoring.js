import IeecloudSideBarRenderer from "../sidebar-renderer/IeecloudSideBarRenderer.js";
import {eventBus} from "../../../main/index.js";
import IeecloudContentService from "../../content/content-core/IeecloudContentService.js";
import {IeecloudTreeInspireImpl} from "ieecloud-tree";
import IeecloudContentController from "../../content/content-core/IeecloudContentController.js";


export default class IeecloudSideBarController {
    #systemController;
    #schemeModel;
    #activeNode;
    #ACTIVE_MODULE_ID = "9bd49c90-4939-4805-a7ec-b207c727b907"; // TODO in properties
    constructor(schemeModel, systemController) {
        this.#schemeModel = schemeModel;
        this.#systemController = systemController;
    }

    init(containerId, contentContainerId) {
        const scope = this;
        // workaround
        this.#activeNode = this.#systemController.getNodeById(this.#ACTIVE_MODULE_ID);

        const sideBarRenderer = new IeecloudSideBarRenderer(containerId);
        sideBarRenderer.render(this.#activeNode, this.#systemController.getTreeModel());

        if (this.#activeNode) {
            scope.#loadSystemModel(this.#activeNode, contentContainerId);
        }

        sideBarRenderer.addEventListener('IeecloudSideBarRenderer.itemClicked', function (event) {
            const item = event.value;
            scope.#activeNode = item;
            sideBarRenderer.redraw(scope.#activeNode);
            scope.#loadSystemModel(item, contentContainerId);
        });


    }

    #loadSystemModel(node, contentContainerId) {
        eventBus.removeAllListeners();
        if (node.id === this.#ACTIVE_MODULE_ID) {
            const containerService = new IeecloudContentService('http://127.0.0.1:3001');
            // const containerService = new IeecloudContentService('http://notebook.ieecloud.com:8080/monitor_izhora_storage/mocks/');
            containerService.getContentScheme('content-scheme.json', function (schemeModel) {

                containerService.getContentData('tree-model-2022-12-08_17_14_38_173.json', function (treeData) {

                    const systemController = new IeecloudTreeInspireImpl();
                    systemController.createTree(treeData);

                    systemController.on('tree.redrawTree', function () {
                        const contentController = new IeecloudContentController(schemeModel, systemController);
                        contentController.init(contentContainerId);

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
}