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
    #childSystemController;
    #containerService;
    constructor(schemeModel, systemController) {
        this.#schemeModel = schemeModel;
        this.#systemController = systemController;
    }

    init(containerId, contentContainerId, treeContainerId, contentOptionsContainerId) {
        const scope = this;

        const activeNode = this.#systemController.getActiveNode();

        const sideBarRenderer = new IeecloudSideBarRenderer(containerId);
        sideBarRenderer.render(activeNode, this.#systemController.getTreeModel());

        if (activeNode) {
            scope.#loadSystemModel(activeNode, contentContainerId, treeContainerId, contentOptionsContainerId);
        }

        sideBarRenderer.addEventListener('IeecloudSideBarRenderer.itemClicked', function (event) {
            const node = event.value;
            if (node.properties?.ref) {
                scope.#hideSideBar();
                window.open(import.meta.env.APP_STATIC_STORAGE + "/" + node.properties.ref, '_blank');
                return false;
            }

            scope.#systemController.setActiveNode(node.id);
            const activeNode = scope.#systemController.getActiveNode();
            sideBarRenderer.redraw(activeNode);
            scope.#loadSystemModel(activeNode, contentContainerId, treeContainerId, contentOptionsContainerId);
        });
    }

    #hideSideBar(){
        const wrapper = document.querySelector("#wrapper");
        wrapper?.classList.remove("sidenav-toggled");
    }

    #loadSystemModel(activeNode, contentContainerId, treeContainerId, contentOptionsContainerId) {
        const scope = this;
        scope.#childSystemController?.destroy();
        eventBus.removeAllListeners();
        scope.#cleanPreviousContentNode(contentContainerId, treeContainerId, scope);

        // TODO: refactor
        scope.#hideSideBar();

        scope.#containerService = new IeecloudContentService(import.meta.env.APP_SERVER_URL);

        const activeModuleCode = activeNode.properties.code;

        scope.#containerService.getContentLayout(activeModuleCode + "/" + import.meta.env.VITE_APP_MODULE_CONTENT_LAYOUT, function (contentLayout) {
            scope.#containerService.getContentLayout(activeModuleCode + "/" + import.meta.env.VITE_APP_MODULE_TREE_SETTINGS, function (treeSettings) {
                scope.#containerService.getContentLayout(activeModuleCode + "/" + import.meta.env.VITE_APP_MODULE_CONTENT_SETTINGS, function (detailsSettings) {
                    scope.#loadModule(activeModuleCode + "/" + import.meta.env.VITE_APP_MODULE_CONTENT_SCHEMA, activeModuleCode + "/" + import.meta.env.VITE_APP_MODULE_CONTENT_MODEL,
                        contentContainerId, treeContainerId, contentOptionsContainerId, treeSettings, contentLayout, detailsSettings);
                });
            });
        });
    }

    #loadModule(contentSchemeFileName, contentModelFileName, contentContainerId,
                treeContainerId, contentOptionsContainerId, treeSettings, contentLayout, detailsSettings) {
        const scope = this;

        scope.#containerService.getContentScheme(contentSchemeFileName, function (schemeModel) {

            scope.#containerService.getContentData(contentModelFileName, schemeModel, function (treeData) {
                scope.#childSystemController = new IeecloudTreeInspireImpl();
                scope.#childSystemController.createTree(treeData);
                // TODO: think about initial ID every time new generated
                scope.#childSystemController.modelId = treeData.id;

                const contentOptionsController = new IeecloudOptionsController(treeSettings, contentLayout, detailsSettings,  schemeModel, scope.#childSystemController);

                const treeController = new IeecloudTreeController(scope.#childSystemController, schemeModel, contentOptionsController.treeSettings);
                treeController.init(treeData.name, treeContainerId, contentOptionsController.layoutModel);

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

}