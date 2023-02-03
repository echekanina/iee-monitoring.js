import IeecloudSideBarRenderer from "../sidebar-renderer/IeecloudSideBarRenderer.js";
import {eventBus} from "../../../main/index.js";
import IeecloudContentService from "../../content/content-core/IeecloudContentService.js";
import {IeecloudTreeInspireImpl} from "ieecloud-tree";
import IeecloudContentController from "../../content/content-core/IeecloudContentController.js";
import IeecloudTreeController from "../../tree/tree-core/IeecloudTreeController.js";
import IeecloudContentOptionsController from "../../options/options-core/IeecloudContentOptionsController.js";



export default class IeecloudSideBarController {
    #systemController;
    #schemeModel;
    #DEFAULT_ACTIVE_MODULE_ID = "9bd49c90-4939-4805-a7ec-b207c727b907"; // TODO in properties
    constructor(schemeModel, systemController) {
        this.#schemeModel = schemeModel;
        this.#systemController = systemController;
    }

    init(containerId, contentContainerId, treeContainerId, contentOptionsContainerId) {
        const scope = this;
        // workaround
        this.#systemController.setActiveNode(this.#DEFAULT_ACTIVE_MODULE_ID);

        const activeNode = this.#systemController.getActiveNode();

        const sideBarRenderer = new IeecloudSideBarRenderer(containerId);
        sideBarRenderer.render(activeNode, this.#systemController.getTreeModel());

        if (activeNode) {
            scope.#loadSystemModel(activeNode, contentContainerId, treeContainerId, contentOptionsContainerId);
        }

        sideBarRenderer.addEventListener('IeecloudSideBarRenderer.itemClicked', function (event) {
            const item = event.value;
            scope.#systemController.setActiveNode(item.id);
            const activeNode = scope.#systemController.getActiveNode();
            sideBarRenderer.redraw(activeNode);
            scope.#loadSystemModel(activeNode, contentContainerId, treeContainerId, contentOptionsContainerId);
        });
    }

    #loadSystemModel(node, contentContainerId, treeContainerId, contentOptionsContainerId) {
        const scope = this;
        eventBus.removeAllListeners();

        // TODO: refactor
        const wrapper = document.querySelector("#wrapper");
        wrapper?.classList.remove("sidenav-toggled");

        if (node.id === scope.#DEFAULT_ACTIVE_MODULE_ID) {
            const containerService = new IeecloudContentService(import.meta.env.VITE_APP_SERVER_URL);

            containerService.getContentScheme(import.meta.env.VITE_CONTENT_SCHEME_FILE_NAME, function (schemeModel) {

                containerService.getContentData(import.meta.env.VITE_CONTENT_MODEL_FILE_NAME, schemeModel,  function (treeData) {

                    const systemController = new IeecloudTreeInspireImpl();
                    systemController.createTree(treeData);

                    const contentOptionsController = new IeecloudContentOptionsController(schemeModel, systemController);

                    const treeController = new IeecloudTreeController(systemController, schemeModel);
                    treeController.init(treeContainerId, contentOptionsController.layoutModel);

                    const contentController = new IeecloudContentController(schemeModel, systemController);
                    contentController.init(contentContainerId, contentOptionsController.layoutModel);

                    contentOptionsController.init(contentOptionsContainerId);

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

    get DEFAULT_ACTIVE_MODULE_ID() {
        return this.#DEFAULT_ACTIVE_MODULE_ID
    }
}