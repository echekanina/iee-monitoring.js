import IeecloudSideBarRenderer from "../sidebar-renderer/IeecloudSideBarRenderer.js";
import {eventBus} from "../../../main/index.js";
import IeecloudContentService from "../../content/content-core/IeecloudContentService.js";
import {IeecloudTreeInspireImpl} from "ieecloud-tree";
import IeecloudContentController from "../../content/content-core/IeecloudContentController.js";

export default class IeecloudSideBarController {
    #systemController;

    constructor(systemController) {
        this.#systemController = systemController;
    }

    init(containerId, contentContainerId) {
        const scope = this;
        const sideBarRenderer = new IeecloudSideBarRenderer(containerId);
        sideBarRenderer.render(this.#systemController.getTreeModel());

        sideBarRenderer.addEventListener('IeecloudSideBarRenderer.itemClicked', function (event) {
            const item = event.value;
            scope.#loadSystemModel(item, contentContainerId);
        });


    }

    #loadSystemModel(node, contentContainerId) {
        eventBus.removeAllListeners();
        const containerService = new IeecloudContentService('http://127.0.0.1:3000');
        containerService.getContentScheme('content-scheme.json', function (schemeModel) {

            containerService.getContentData('tree-model-2022-11-22_17_33_03_152.json', function (treeData) {

                const systemController = new IeecloudTreeInspireImpl();
                systemController.createTree(treeData);

                systemController.on('tree.redrawTree', function () {
                    const contentController = new IeecloudContentController(schemeModel, systemController);
                    contentController.init(contentContainerId);

                });
            });
        });
        //     contentWrapperElement.innerHTML = '';

    }
}