import IeecloudSideBarRenderer from "../sidebar-renderer/IeecloudSideBarRenderer.js";
import {eventBus} from "../../../main/index.js";
import * as singleSpa from "single-spa";
import {registerApplication, start} from "single-spa";
import IeecloudAppUtils from "../../../main/utils/IeecloudAppUtils.js";

export default class IeecloudSideBarController {
    #systemController;
    #schemeModel;
    #menuTreeSettings;
    #sideBarRenderer;
    #innerTreeNodeId;

    constructor(schemeModel, systemController, menuTreeSettings) {
        this.#schemeModel = schemeModel;
        this.#systemController = systemController;
        this.#menuTreeSettings = menuTreeSettings;
    }

    init(containerId, contentContainerId, treeContainerId, contentOptionsContainerId) {
        const scope = this;

        const defaultActiveNode = this.#systemController.getActiveNode();

        scope.#sideBarRenderer = new IeecloudSideBarRenderer(containerId);
        scope.#sideBarRenderer.render(defaultActiveNode, this.#systemController.getTreeModel());

        scope.#registerModulesAndStart(contentContainerId, treeContainerId, contentOptionsContainerId);

        scope.#sideBarRenderer.addEventListener('IeecloudSideBarRenderer.itemClicked', function (event) {
            const node = event.value;
            if (node.properties?.ref) {
                scope.#hideSideBar();
                window.open(import.meta.env.APP_STATIC_STORAGE + "/" + node.properties.ref + "?ms=" + Date.now(), '_blank');
                return false;
            }
            if (node.properties?.code === "docs") {
                const status = singleSpa.getAppStatus(node.properties?.code);
                if (status !== "MOUNTED") {
                    if (node.properties?.link) {
                        scope.#navigateToRegApplication(node);
                        scope.#innerTreeNodeId = node.properties?.link;
                    } else {
                        scope.#navigateToRegApplication(node);
                    }
                } else {
                    scope.#systemController.setActiveNode(node.id);
                    const activeNode = scope.#systemController.getActiveNode();
                    scope.#sideBarRenderer.redraw(activeNode);
                    scope.#hideSideBar();
                    const urlMetaData = {activeNodeIdFromUrl: node.properties?.link};
                    eventBus.emit('IeecloudSideBarController.innerTreeNodeIdChanged', urlMetaData, false);
                }
                return false;
            }
            scope.#navigateToRegApplication(node);
        });
    }

    #hideSideBar() {
        const wrapper = document.querySelector("#wrapper");
        wrapper?.classList.remove("sidenav-toggled");
    }

    goToRegApplicationListener = (regMetaData) => {
        const scope = this;
        const valueArray = regMetaData.split('?');
        if (valueArray?.length > 0) {
            const regAppCode = valueArray[0];
            const node = scope.#systemController.getNodeByCode(regAppCode);
            scope.#navigateToRegApplication(node);
            scope.#innerTreeNodeId = valueArray[1].split('=')[1];
        }
    }


    #navigateToRegApplication(node) {
        const scope = this;
        scope.#systemController.setActiveNode(node.id);
        const activeNode = scope.#systemController.getActiveNode();
        scope.#sideBarRenderer.redraw(activeNode);

        eventBus.removeAllListeners();
        scope.#hideSideBar();
        const activeModuleCode = activeNode.properties.code;
        singleSpa.navigateToUrl("#/" + import.meta.env.APP_CODE + "/" + activeModuleCode);
    }

    #mapNode(node, apps) {
        if (node.hasChildren()) {
            for (let i = 0, l = node.children.length; i < l; i++) {
                const child = node.children[i];
                if (child.properties.ref) {
                    continue;
                }
                if (child.properties.isApp) {
                    let appNode = {nodeId: child.id, appText: child.text, appCode: child.properties.code};
                    apps.push(appNode);
                }
                this.#mapNode(child, apps);
            }
        }
    }

    #registerModulesAndStart(contentContainerId, treeContainerId, contentOptionsContainerId) {
        const scope = this;
        const treeModel = this.#systemController.getTreeModel();
        const treeNodes = treeModel.nodes;

        const apps = [];

        treeNodes.forEach(node => {
            scope.#mapNode(node, apps);
            if (node.properties.isApp) {
                let appNode = {nodeId: node.id, appText: node.text, appCode: node.properties.code};
                apps.push(appNode);
            }
        });

        // https://single-spa.js.org/docs/recommended-setup/#cross-microfrontend-imports - important info
        apps.forEach((app) => registerApplication({
            name: app.appCode,
            app: () => {
                return import("./IeecloudMenuItemController.js");
            },
            activeWhen: () => {
                return location.hash.startsWith("#/" + import.meta.env.APP_CODE + "/" + app.appCode);
            },
            customProps: {
                name: app.appCode,
                appData: app,
                contentContainerId: contentContainerId,
                treeContainerId: treeContainerId,
                contentOptionsContainerId: contentOptionsContainerId,
                schemeModel: scope.#schemeModel,
                systemController: scope.#systemController,
                menuTreeSettings: scope.#menuTreeSettings,
                sideBarRenderer: scope.#sideBarRenderer,
                sideBarController: scope
            }
        }));

        start();

        const defaultActiveNode = this.#systemController.getActiveNode();

        if (defaultActiveNode) {
            const appNameFromHash = IeecloudAppUtils.parseHashApp(location.hash);
            if (window.location.hash === '' || (appNameFromHash === import.meta.env.APP_CODE && IeecloudAppUtils.isOnlyProjectInHash(location.hash))) {
                const activeModuleCode = defaultActiveNode.properties.code;
                singleSpa.navigateToUrl("#/" + import.meta.env.APP_CODE + "/" + activeModuleCode);
                return;
            }

            if ((appNameFromHash === import.meta.env.APP_CODE && !IeecloudAppUtils.isOnlyProjectInHash(location.hash))) {
                // try to get app name
                const spaAppName = IeecloudAppUtils.parseSPAAppName(location.hash);
                const app = apps.find(app => app.appCode === spaAppName);
                if (app) {
                    const node = scope.#systemController.getNodeById(app.nodeId);
                    if (node) {
                        const params = IeecloudAppUtils.parseHashParams(location.hash);

                        const nodeId = params['id'];
                        if (nodeId) {
                            eventBus.emit('index.paramsValue', nodeId, false);
                            return;
                        }

                        scope.#navigateToRegApplication(node);
                    } else {
                        window.errorHandlerController.showError(404, "Неправильный адрес в адресной строке :" + spaAppName, false);
                    }
                } else {
                    window.errorHandlerController.showError(404, "Неправильный адрес в адресной строке : " + spaAppName, false);
                }
            }
        }
    }

    get innerTreeNodeId() {
        return this.#innerTreeNodeId;
    }

}
