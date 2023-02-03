import IeecloudTreeRenderer from "../tree-renderer/IeecloudTreeRenderer.js";
import IeecloudTreeService from "./IeecloudTreeService.js";
import {eventBus} from "../../../main/index.js";
import {cloneDeep} from "lodash-es";

export default class IeecloudTreeController {
    #systemController;
    #schemeModel;
    #layoutModel;

    constructor(systemController, schemeModel) {
        this.#systemController = systemController;
        this.#schemeModel = schemeModel;

    }


    init(containerId, layout) {
        const scope = this;
        scope.#layoutModel = cloneDeep(layout);


        const treeRenderer = new IeecloudTreeRenderer(containerId);
        treeRenderer.render();

        scope.#gatherAndSetTreeNodeStatuses();


        treeRenderer.addEventListener('IeecloudTreeRenderer.setActiveNode', function (event) {
            const item = event.value;
            const activeNode = scope.#systemController.getActiveNode();
            let layoutModel = scope.#layoutModel[activeNode.schemeId];
            if (layoutModel.dialog) {
                scope.#systemController.setActiveNode(item.id);
            } else {
                if (activeNode.id !== item.id) {
                    scope.#systemController.setActiveNode(item.id);
                }
            }


        });

        scope.#systemController.on('tree.redrawTree', function (tree) {
            treeRenderer.redrawTree(tree);
        });

        eventBus.on('IeecloudContentOptionsController.layoutChanged', function (layout) {
            scope.#layoutModel = cloneDeep(layout);
        });


    }

    #gatherAndSetTreeNodeStatuses() {
        const scope = this;
        const treeModel = scope.#systemController.getTreeModel();

        let rootNode = scope.#findRootElement(scope.#schemeModel.rootElements, treeModel);

        const nodeProps = rootNode.properties;

        const treeService = new IeecloudTreeService(nodeProps.dataService);

        treeService.readScheme(nodeProps, function (nodeScheme) {

            let promises = [];

            scope.#recurseDown(function (node) {
                if (node.schemeId !== "e751df2a-object-element-sensor") {
                    const nodeProps = node.properties;
                    promises.push(treeService.readData(nodeProps));
                }
            }, treeModel?._nodes);


            Promise.all(promises).then(responses => Promise.all(responses.map(r => r.json())))
                .then(responses => scope.#collectStatusData(responses, treeService, nodeScheme)).then(data => {
                scope.#fillByCalculatedCount(data);
                scope.#systemController.setStatusNodes(data);
            });

        });
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
        const nodeIds = Object.keys(data);
        let valuesArray = [];
        for (let key in data) {
            valuesArray.push(data[key]);
        }
        nodeIds.forEach(function (nodeId) {
            let valuesWithParent = valuesArray.filter(value => {
                return value.parent_id + '' === nodeId;
            });

            if (valuesWithParent.length > 0) {
                data[nodeId]["statusText"] = valuesWithParent.length;
            } else {
                data[nodeId]["statusText"] = 1;
            }
        });
    }
}