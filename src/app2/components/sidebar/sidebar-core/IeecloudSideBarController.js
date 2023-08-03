import IeecloudSideBarRenderer from "../sidebar-renderer/IeecloudSideBarRenderer.js";
import {eventBus} from "../../../main/index.js";
import IeecloudContentService from "../../content/content-core/IeecloudContentService.js";
import {IeecloudTreeInspireImpl} from "ieecloud-tree";
import IeecloudContentController from "../../content/content-core/IeecloudContentController.js";
import IeecloudTreeController from "../../tree/tree-core/IeecloudTreeController.js";
import IeecloudOptionsController from "../../options/options-core/IeecloudOptionsController.js";

export default class IeecloudSideBarController {
    #systemController;
    #schemeModel;
    #DEFAULT_ACTIVE_MODULE_ID = "9bd49c90-4939-4805-a7ec-b207c727b907"; // TODO in properties
    #childSystemController;
    #containerService;
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
        scope.#childSystemController?.destroy();
        eventBus.removeAllListeners();
        scope.#cleanPreviousContentNode(contentContainerId, treeContainerId, scope);

        // TODO: refactor
        const wrapper = document.querySelector("#wrapper");
        wrapper?.classList.remove("sidenav-toggled");

        scope.#containerService = new IeecloudContentService(import.meta.env.VITE_APP_SERVER_URL);

        if (node.id === scope.#DEFAULT_ACTIVE_MODULE_ID) {
            scope.#containerService.getContentLayout(import.meta.env.VITE_CONTENT_LAYOUT_FILE_NAME, function (objectMonitoringLayout) {
                scope.#containerService.getContentLayout(import.meta.env.VITE_TREE_SETTINGS_FILE_NAME, function (treeContentSettings) {
                    scope.#containerService.getContentLayout(import.meta.env.VITE_CONTENT_SETTINGS_FILE_NAME, function (detailsSettings) {
                        scope.#loadModule(import.meta.env.VITE_CONTENT_SCHEME_FILE_NAME, import.meta.env.VITE_CONTENT_MODEL_FILE_NAME,
                            contentContainerId, treeContainerId, contentOptionsContainerId, treeContentSettings, objectMonitoringLayout, detailsSettings);
                    });
                });
            });
            return;
        }

        if (node.id === "c82b25be-1146-4208-8d34-866cbf3e9244") {
            scope.#containerService.getContentLayout(import.meta.env.VITE_CONTENT_STORE_LAYOUT_FILE_NAME, function (storeLayout) {
                scope.#containerService.getContentLayout(import.meta.env.VITE_TREE_STORE_SETTINGS_FILE_NAME, function (treeStoreSettings) {
                    scope.#containerService.getContentLayout(import.meta.env.VITE_CONTENT_SETTINGS_FILE_NAME, function (detailsSettings) {
                        scope.#loadModule(import.meta.env.VITE_STORE_CONTENT_SCHEME_FILE_NAME, import.meta.env.VITE_STORE_CONTENT_MODEL_FILE_NAME,
                            contentContainerId, treeContainerId, contentOptionsContainerId, treeStoreSettings, storeLayout, detailsSettings);
                    });
                });
            });
        }
    }

    #loadModule(contentSchemeFileName, contentModelFileName, contentContainerId,
                treeContainerId, contentOptionsContainerId, treeSettings, contentLayout, detailsSettings) {
        const scope = this;

        scope.#containerService.getContentScheme(contentSchemeFileName, function (schemeModel) {

            scope.#containerService.getContentData(contentModelFileName, schemeModel, function (treeData) {
                scope.#childSystemController = new IeecloudTreeInspireImpl();
                scope.#childSystemController.createTree(treeData);

                const contentOptionsController = new IeecloudOptionsController(treeSettings, contentLayout, detailsSettings,  schemeModel, treeData, scope.#childSystemController);

                const treeController = new IeecloudTreeController(scope.#childSystemController, schemeModel);
                treeController.init(treeData.name, treeContainerId, contentOptionsController.treeSettings, contentOptionsController.layoutModel);

                const contentController = new IeecloudContentController(schemeModel, scope.#childSystemController);
                contentController.init(contentContainerId, contentOptionsController.layoutModel);
                contentOptionsController.init(contentOptionsContainerId);

                scope.#systemController["childSystemController"] = scope.#childSystemController;

            });
        });
    }

    #cleanPreviousContentNode(contentContainerId, treeContainerId, scope) {
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
        scope.#childSystemController = null;
    }

    get DEFAULT_ACTIVE_MODULE_ID() {
        return this.#DEFAULT_ACTIVE_MODULE_ID
    }
}