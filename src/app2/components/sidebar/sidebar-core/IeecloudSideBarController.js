import IeecloudSideBarRenderer from "../sidebar-renderer/IeecloudSideBarRenderer.js";
import {eventBus} from "../../../main/index.js";
import IeecloudContentService from "../../content/content-core/IeecloudContentService.js";
import {IeecloudTreeInspireImpl} from "ieecloud-tree";
import IeecloudContentController from "../../content/content-core/IeecloudContentController.js";
import IeecloudTreeController from "../../tree/tree-core/IeecloudTreeController.js";
import IeecloudOptionsController from "../../options/options-core/IeecloudOptionsController.js";

import objectMonitoringLayout from "./content-layout.json"
import storeLayout from "./content-store-layout.json"

import treeContentSettings from "../../options/options-core/tree-settings.json"
import treeStoreSettings from "../../options/options-core/tree-store-settings.json"


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
        scope.#cleanPreviousContentNode(contentContainerId, treeContainerId, scope);

        // TODO: refactor
        const wrapper = document.querySelector("#wrapper");
        wrapper?.classList.remove("sidenav-toggled");

        if (node.id === scope.#DEFAULT_ACTIVE_MODULE_ID) {
            scope.#loadModule(import.meta.env.VITE_CONTENT_SCHEME_FILE_NAME, import.meta.env.VITE_CONTENT_MODEL_FILE_NAME,
                contentContainerId, treeContainerId, contentOptionsContainerId, treeContentSettings, objectMonitoringLayout);
            return;
        }

        if (node.id === "c82b25be-1146-4208-8d34-866cbf3e9244") {
            scope.#loadModule(import.meta.env.VITE_STORE_CONTENT_SCHEME_FILE_NAME, import.meta.env.VITE_STORE_CONTENT_MODEL_FILE_NAME,
                contentContainerId, treeContainerId, contentOptionsContainerId, treeStoreSettings, storeLayout);
        }
    }

    #loadModule(contentSchemeFileName, contentModelFileName, contentContainerId,
                treeContainerId, contentOptionsContainerId, treeSettings, contentLayout) {
        const scope = this;
        const containerService = new IeecloudContentService(import.meta.env.VITE_APP_SERVER_URL);
        containerService.getContentScheme(contentSchemeFileName, function (schemeModel) {

            containerService.getContentData(contentModelFileName, schemeModel, function (treeData) {
                const systemController = new IeecloudTreeInspireImpl();
                systemController.createTree(treeData);

                const contentOptionsController = new IeecloudOptionsController(treeSettings, contentLayout, schemeModel, treeData, systemController);

                const treeController = new IeecloudTreeController(systemController, schemeModel);
                treeController.init(treeData.name, treeContainerId, contentOptionsController.treeSettings, contentOptionsController.layoutModel);

                const contentController = new IeecloudContentController(schemeModel, systemController);
                contentController.init(contentContainerId, contentOptionsController.layoutModel);
                contentOptionsController.init(contentOptionsContainerId);

                scope.#systemController["childSystemController"] = systemController;

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
    }

    get DEFAULT_ACTIVE_MODULE_ID() {
        return this.#DEFAULT_ACTIVE_MODULE_ID
    }
}