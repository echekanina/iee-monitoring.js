import IeecloudContentService from "../../content/content-core/IeecloudContentService.js";
import {IeecloudTreeInspireImpl, IeecloudTreeSchemeParser} from "ieecloud-tree";
import {cloneDeep} from "lodash-es";
import IeecloudOptionsController from "../../options/options-core/IeecloudOptionsController.js";
import IeecloudTreeController from "../../tree/tree-core/IeecloudTreeController.js";
import IeecloudContentController from "../../content/content-core/IeecloudContentController.js";
import {eventBus} from "../../../main/index.js";

export default class IeecloudMenuItemController {
    #schemeModel;
    #systemController;
    #menuTreeSettings;
    #containerService;
    #childSystemController;
    #contentController;

    constructor(schemeModel, systemController, menuTreeSettings) {
        this.#schemeModel = schemeModel;
        this.#systemController = systemController;
        this.#menuTreeSettings = menuTreeSettings;
    }

    load(contentContainerId, treeContainerId, contentOptionsContainerId, childTreeActiveNodeId) {

        const scope = this;
        const activeNode = this.#systemController.getActiveNode();

        scope.#containerService = new IeecloudContentService(import.meta.env.APP_SERVER_URL, import.meta.env.APP_SERVER_ROOT_URL);

        const activeModuleCode = activeNode.properties.code;
        const repoId = activeNode.properties.repoId;
        const formatData = activeNode.properties.formatData;

        let contentMetaData = {};
        contentMetaData.contentModelFileName = activeModuleCode + "/" + import.meta.env.VITE_APP_MODULE_CONTENT_MODEL;
        contentMetaData.useApi = false;
        if (repoId && repoId.trim().length !== 0) {
            contentMetaData.useApi = true;
            contentMetaData.repoId = repoId;
            contentMetaData.formatData = formatData;
        }

        scope.#containerService.getContentLayout(activeModuleCode + "/" + import.meta.env.VITE_APP_MODULE_CONTENT_LAYOUT, function (contentLayout) {
            scope.#containerService.getContentLayout(activeModuleCode + "/" + import.meta.env.VITE_APP_MODULE_TREE_SETTINGS, function (treeSettings) {
                scope.#containerService.getContentLayout(activeModuleCode + "/" + import.meta.env.VITE_APP_MODULE_CONTENT_SETTINGS, function (detailsSettings) {
                    scope.#loadModule(activeModuleCode + "/" + import.meta.env.VITE_APP_MODULE_CONTENT_SCHEMA, contentMetaData,
                        contentContainerId, treeContainerId, contentOptionsContainerId, treeSettings, contentLayout, detailsSettings,
                        childTreeActiveNodeId);
                });
            });
        });
    }



    #loadModule(contentSchemeFileName, contentMetaData, contentContainerId,
                treeContainerId, contentOptionsContainerId, treeSettings, contentLayout, detailsSettings,
                activeNodeIdFromUrl) {
        const scope = this;

        scope.#containerService.getContentScheme(contentSchemeFileName, function (schemeModel) {

            scope.#containerService.getContentData(contentMetaData, schemeModel, function (treeData) {
                scope.#childSystemController = new IeecloudTreeInspireImpl();
                scope.#childSystemController.createTree(treeData);
                // TODO: think about initial ID every time new generated
                scope.#childSystemController.modelId = treeData.id;
                scope.#childSystemController["viewContentModelNode"] =
                    scope.#systemController.getNodeById(scope.#menuTreeSettings.activeNode)

                // TODO: temp solution , need to change ieecloud-tree lib remove static fields
                scope.#childSystemController["treeNodesSchemeMap"] =
                    cloneDeep(IeecloudTreeSchemeParser.nodesMap);

                const contentOptionsController = new IeecloudOptionsController(treeSettings, contentLayout, detailsSettings,  schemeModel, scope.#childSystemController);

                const urlMetaData = {activeNodeIdFromUrl: activeNodeIdFromUrl};

                const treeController = new IeecloudTreeController(scope.#childSystemController, schemeModel,
                    contentOptionsController.treeSettings, urlMetaData);
                treeController.init(treeData.name, treeContainerId, contentOptionsController.layoutModel);

                scope.#contentController = new IeecloudContentController(schemeModel, scope.#childSystemController);
                scope.#contentController.init(contentContainerId, contentOptionsController.layoutModel);
                contentOptionsController.init(contentOptionsContainerId);

                scope.#systemController["childSystemController"] = scope.#childSystemController;
            });
        });
    }


    get childSystemController(){
        return this.#childSystemController;
    }

    get contentController(){
        return this.#contentController;
    }

}

export function bootstrap(props) {
    return Promise.resolve().then(() => {
        // One-time initialization code goes here
    });
}

export function mount(props) {
    return Promise.resolve().then(() => {
        const queryString = location.search;
        const params = new URLSearchParams(queryString);
        const childTreeActiveNodeId = params.get("id");

        props.systemController.setActiveNode(props.appData.nodeId); // set active module

        const activeNode = props.systemController.getActiveNode();
        props.sideBarRenderer.redraw(activeNode);
        // // TODO: find a way share it within unmount function
        window.sideBarMenuItemController = new IeecloudMenuItemController(props.schemeModel, props.systemController, props.menuTreeSettings);
        window.sideBarMenuItemController.load(props.contentContainerId,
            props.treeContainerId, props.contentOptionsContainerId, childTreeActiveNodeId);
    });
}

export function unmount(props) {
    return Promise.resolve().then(() => {
        window.sideBarMenuItemController.childSystemController?.destroy();
        eventBus.removeAllListeners();

         window.sideBarMenuItemController.contentController?.destroy();
        let container = document.querySelector("#" + props.contentContainerId);
        if (container) {
            document.querySelector("#" + props.contentContainerId).innerHTML = '';
        }

        container = document.querySelector("#" +  props.treeContainerId);
        if (container) {
            document.querySelector("#" +  props.treeContainerId).innerHTML = '';
        }

        const wrapper = document.querySelector("#wrapper");
        wrapper?.classList.remove("tree-toggled");

        window.sideBarMenuItemController = null;
        delete window.sideBarMenuItemController;

    });


}