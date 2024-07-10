import IeecloudTreeRenderer from "../tree-renderer/IeecloudTreeRenderer.js";
import IeecloudTreeService from "./IeecloudTreeService.js";
import {eventBus} from "../../../main/index.js";
import {cloneDeep, difference, isEqual, reduce} from "lodash-es";
import IeecloudAppUtils from "../../../main/utils/IeecloudAppUtils.js";
import IeecloudTableController
    from "../../content/page-content/page-content-core/view/table/IeecloudTableController.js";
import {v4 as uuidv4} from "uuid";

export default class IeecloudTreeController {
    #systemController;
    #schemeModel;
    #layoutModel;
    #treeSettings;
    #treeRenderer;
    #treeService;
    #tableViewController;

    constructor(systemController, schemeModel, treeSettings, urlMetaData) {
        this.#systemController = systemController;
        this.#schemeModel = schemeModel;
        this.#treeSettings = treeSettings;
        this.#applyTreeSettings(urlMetaData);
    }


    init(treeName, containerId, layout) {
        const scope = this;
        scope.#layoutModel = cloneDeep(layout);

        scope.#treeRenderer = new IeecloudTreeRenderer(treeName, containerId, scope.#treeSettings.scrollAutoToActive);
        scope.#treeRenderer.render();

        scope.#treeService = new IeecloudTreeService();

        scope.#applyRenderTreeSettings();


        scope.#treeRenderer?.addEventListener('IeecloudTreeRenderer.setActiveNode', function (event) {
            const item = event.value;
            scope.#goToNewStateById(item.id);
        });

        scope.#treeRenderer?.addEventListener('IeecloudTreeRenderer.searchNode', function (event) {
            const searchText = event.value;
            scope.#systemController.searchNodeAndRedrawTree(searchText);
        });

        scope.#treeRenderer?.addEventListener('IeecloudTreeRenderer.showIncidents', function (event) {
            const popoverData = event.value;
            scope.#tableViewController = new IeecloudTableController({width: '1000px', dataType : "incidents", id:  uuidv4()}, scope.#systemController, "client");
            let tableWrapper = document.createElement('div');
            tableWrapper.id = popoverData.statusElementId + "-table-wrapper";
            tableWrapper.style.width = 'fit-content';
            scope.#tableViewController.init(tableWrapper, popoverData.node);
            scope.#treeRenderer.showIncidentPopover(popoverData, tableWrapper);


        });

        scope.#treeRenderer?.addEventListener('IeecloudTreeRenderer.incidentsDispose', function (event) {
            scope.#tableViewController.destroy();
        });


        scope.#systemController.on('tree.redrawTree', function (tree) {
            scope.#treeRenderer?.redrawTree(tree);
        });

        eventBus.on('IeecloudContentOptionsController.layoutChanged', function (layout) {
            scope.#layoutModel = cloneDeep(layout);
        });

        eventBus.on('IeecloudTreeStructureOptionsController.treeSettingsChanged', function (treeSettings) {

            const oldTreeSettings = cloneDeep(scope.#treeSettings);
            scope.#treeSettings = cloneDeep(treeSettings);
            const differenceOfKeys = (...objects) =>
                difference(...objects.map(obj => Object.keys(obj)));
            const differenceObj = (a, b) =>
                reduce(a, (result, value, key) => (
                    isEqual(value, b[key]) ? result : [...result, key]
                ), differenceOfKeys(b, a));

            const settingWasChanged = differenceObj(oldTreeSettings, treeSettings);
            if (settingWasChanged && settingWasChanged.length > 0) {
                scope.#updateTreeStateByNewSettings(settingWasChanged[0]);
            }
        });

        eventBus.on('IeecloudTableRenderer.rowClick', function (data) {
// TODO:add search by id to tree lib
            if (data.hasOwnProperty("objId") && data.objId !== '') {
                scope.#goToNewStateById(data.objId?.toString())
            }


        });

        eventBus.on('IeecloudSearchBlockController.itemClicked', function (nodeId) {
            scope.#goToNewStateById(nodeId);
        });

        eventBus.on('index.paramsValue', this.#hashChangeListener);
    }

    #hashChangeListener = (nodeId) => {
        this.#goToNewStateById(nodeId);
    }

    #applyRenderTreeSettings() {
        let scope = this;
        if (scope.#treeSettings?.showBadges) {
            scope.#gatherAndSetTreeNodeStatuses();
        }

        if (IeecloudAppUtils.isMobileDevice()) {
            scope.#treeRenderer?.viewTreePanel(scope.#treeSettings.defaultTreeView);
        }

        if (scope.#treeSettings?.resizeTree) {
            let treeWrapper = document.getElementById("resizerX");
            treeWrapper?.classList.remove('d-none');
        }

        if (scope.#treeSettings?.searchNodeTree) {
            let treeWrapper = document.getElementById("tree-search-block");
            treeWrapper?.classList.remove('d-none');
        }
    }

    #applyTreeSettings(urlMetaData) {
        let scope = this;

        if (urlMetaData) {
            const nodeById = scope.#systemController.getNodeById(urlMetaData.activeNodeIdFromUrl);
            if (nodeById) {
                scope.#systemController.setActiveNode(urlMetaData.activeNodeIdFromUrl);
                scope.#modifyUrlAddressWithoutReload(urlMetaData.activeNodeIdFromUrl);
                return;
            }
        }

        if (scope.#isActiveNodeInSettings()) {
            scope.#systemController.setActiveNode(scope.#treeSettings?.activeNode);
            if (urlMetaData) {
                scope.#modifyUrlAddressWithoutReload(scope.#treeSettings?.activeNode);
            }

        } else if (scope.#isActiveNodeSchemeInSettings()) {

            const firstNodeByScheme = scope.#find(node1 => scope.#treeSettings.activeNodeScheme === node1.schemeId, scope.#systemController.getTreeModel());
            if (firstNodeByScheme) {
                scope.#systemController.setActiveNode(firstNodeByScheme.id);
                if (urlMetaData) {
                    scope.#modifyUrlAddressWithoutReload(firstNodeByScheme.id);
                }
            } else {
                console.error(`Node with schemeNodeId = ${scope.#treeSettings.activeNodeScheme} not found in the tree model. Please check node model props or tree-settings.json`)
            }
        } else {
            console.error(`Active node setting not found`)
        }
    }

    #gatherAndSetTreeNodeStatuses() {
        const scope = this;
        const treeModel = scope.#systemController.getTreeModel();

        let rootNode = scope.#findRootElement(scope.#schemeModel.rootElements, treeModel);

        const nodeProps = rootNode.properties;

        scope.#treeRenderer.showSpinner();


        scope.#treeService.readScheme(nodeProps, function (nodeScheme) {

            let promises = [];

            promises.push(scope.#treeService.readAllStateData(nodeProps));


            Promise.all(promises).then(responses => Promise.all(responses.map(r => r.json())))
                .then(responses => scope.#collectStatusData(responses, scope.#treeService, nodeScheme)).then(data => {
                scope.#fillByCalculatedCount(data);
                scope.#systemController.setStatusNodes(data);
                scope.#treeRenderer.removeSpinner();
            });

        });
    }

    #isActiveNodeInSettings() {
        const scope = this;
        return !(!scope.#treeSettings.activeNode || scope.#treeSettings.activeNode.trim().length === 0);
    }

    #isActiveNodeSchemeInSettings() {
        const scope = this;
        return !(!scope.#treeSettings.activeNodeScheme || scope.#treeSettings.activeNodeScheme.trim().length === 0);
    }

    #collectStatusData(responses, treeService, nodeScheme) {
        let schemeDataMap = {};
        responses.forEach(result => {
            let nodeStatusData = treeService.mapData(result, nodeScheme);
            if (nodeStatusData) {
                for (let key in nodeStatusData) {
                    schemeDataMap[key] = nodeStatusData[key];
                }
            }
        });

        return schemeDataMap;
    }

    #findRootElement(schemeRootElements) {
        let rootDataNode;
        if (schemeRootElements && schemeRootElements.length === 1) {
            const rootElement = schemeRootElements[0];
            // TODO add api to tree find node by schemeId
            rootDataNode = this.#find(node1 => rootElement.id === node1.schemeId, this.#systemController.getTreeModel());
        }
        return rootDataNode;
    }

    #find(predicate, treeModel) {
        let match;
        this.#recurseDown(function (node) {
            if (predicate(node)) {
                match = node;
                return false;
            }
        }, treeModel?._nodes);
        return match;
    }

    #recurseDown(iteratee, obj) {
        let scope = this;
        if (obj instanceof Array) {

            obj.forEach(node => {
                scope.#recurseDown(iteratee, node)
            });

        } else if (obj instanceof Object) {
            if (iteratee(obj) !== false && obj.hasChildren()) {
                scope.#recurseDown(iteratee, obj.children);
            }
        }
    }

    #fillByCalculatedCount(data) {
        for (let key in data) {
            data[key]["statusText"] = data[key]["countNotNorm"];
        }
    }

    #modifyUrlAddressWithoutReload(activeNodeId) {
        const queryString = location.search;
        const params = new URLSearchParams(queryString);
        params.set("id", activeNodeId);
        const prefixArray = location.hash.split( "?")
        window.history.pushState(null, '', prefixArray[0] + "?" + params.toString())
    }

    #goToNewStateById(nodeId) {
        const scope = this;

        const newActiveNode = scope.#systemController.getNodeById(nodeId);
        const activeNode = this.#systemController.getActiveNode();
        let layoutModel = scope.#layoutModel[activeNode?.schemeId];
        if (layoutModel?.dialog) {
            if (newActiveNode) {
                this.#systemController.setActiveNode(newActiveNode.id);
                this.#modifyUrlAddressWithoutReload(newActiveNode.id);
            }
        } else {
            if (newActiveNode && activeNode?.id !== newActiveNode.id) {
                this.#systemController.setActiveNode(newActiveNode.id);
                this.#modifyUrlAddressWithoutReload(newActiveNode.id);
            }
        }

        if (IeecloudAppUtils.isMobileDevice()) {
            scope.#treeRenderer?.hideTreeListener();
        }


    }

    #updateTreeStateByNewSettings(settingWasChanged) {
        const scope = this;
        switch (settingWasChanged) {
            case "showBadges":
                if (scope.#treeSettings[settingWasChanged]) {
                    scope.#gatherAndSetTreeNodeStatuses();
                } else {
                    scope.#systemController.cleanStatusNodes();
                }
                break;
            case "activeNode":
                if (scope.#isActiveNodeInSettings()) {
                    scope.#goToNewStateById(scope.#treeSettings[settingWasChanged]);
                }
                break;
            case "activeNodeScheme":
                if (!scope.#isActiveNodeInSettings()) {
                    if (scope.#isActiveNodeSchemeInSettings()) {
                        const firstNodeByScheme = scope.#find(node1 =>
                                scope.#treeSettings[settingWasChanged] === node1.schemeId,
                            scope.#systemController.getTreeModel());
                        if (firstNodeByScheme) {
                            scope.#goToNewStateById(firstNodeByScheme.id);
                        }
                    }
                } else {
                    console.error(`Active node has already set`)
                }
                break;
            case "scrollAutoToActive":
                scope.#treeRenderer.setScrollAutoToActive(scope.#treeSettings[settingWasChanged]);
                break;

            case "resizeTree":
                const resizeSetting = scope.#treeSettings[settingWasChanged];
                let treeWrapper = document.getElementById("resizerX");
                if (resizeSetting) {
                    treeWrapper?.classList.remove('d-none');
                } else {
                    treeWrapper?.classList.add('d-none');
                }

                break;
            case "searchNodeTree":
                const searchNodeTreeSetting = scope.#treeSettings[settingWasChanged];
                let searchNodeTreeBlock = document.getElementById("tree-search-block");
                if (searchNodeTreeSetting) {
                    searchNodeTreeBlock?.classList.remove('d-none');
                } else {
                    searchNodeTreeBlock?.classList.add('d-none');
                }

                break;
            case "defaultTreeView":
                const treeViewSetting = scope.#treeSettings[settingWasChanged];
                scope.#treeRenderer.viewTreePanel(treeViewSetting);
                break;
            default:
                console.error(`Setting with model ${settingWasChanged} do not handled`)
        }
    }

    // TODO use for level setting
    categorize(settingWasChanged) {
        if (settingWasChanged.includes('showBadges')) {
            return 'showBadges';
        }
        return settingWasChanged;
    }
}