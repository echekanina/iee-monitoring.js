import IeecloudBreadCrumbRenderer from "../breadcrumb-renderer/IeecloudBreadCrumbRenderer.js";
import {eventBus} from "../../../../main/index.js";

export default class IeecloudBreadcrumbController {
    #systemController;
    #schemeModel;
    #breadCrumbRender;

    constructor(schemeModel, systemController) {
        this.#schemeModel = schemeModel;
        this.#systemController = systemController;
    }

    init(breadcrumbContainerId) {
        const scope = this;
        let rootNode = this.#findRootElement(this.#schemeModel.rootElements);
        this.#systemController.setActiveNode(rootNode.id);
        const activeNode = this.#systemController.getActiveNode();
        this.#breadCrumbRender = new IeecloudBreadCrumbRenderer(this, breadcrumbContainerId);
        let systemModel = this.#systemController.getPathByNodeId(activeNode.id)
        this.#breadCrumbRender.render(systemModel);

        scope.#systemController.on('tree.activeNodeSet', function (node) {
            const activeNode = scope.#systemController.getActiveNode();
            let systemModel = scope.#systemController.getPathByNodeId(activeNode.id)
            scope.#breadCrumbRender.render(systemModel);
        });

        eventBus.on('IeecloudTableRenderer.rowClick', function (data) {
            scope.#goToNewState(data);
        });

        eventBus.on('IeecloudTopBarController.itemClicked', function (nodeId) {
            scope.#goToNewStateById(nodeId);
        });

        scope.#breadCrumbRender.addEventListener('IeecloudBreadCrumbRenderer.itemClicked', function (event) {
            const nodeId = event.value;
            scope.#goToNewStateById(nodeId);

        });
    }

    #goToNewState(data) {
        const activeNode = this.#systemController.getActiveNode();
        if (activeNode.id === data.activeNode.id) {
            // go to child node
            if (activeNode.hasChildren()) {

                let newActiveNode = undefined;
                // check if passed objId or objCode
                if(data.hasOwnProperty("objId") && data.objId !== '') {
                    newActiveNode = activeNode.children.find(value => value.properties.id === data.objId + "");
                } else if(data.hasOwnProperty("objCode") && data.objCode !== '') {
                    newActiveNode = activeNode.children.find(value => value.properties.code === data.objCode + "");
                } else if(data.hasOwnProperty("objName") && data.objName !== '') {
                    newActiveNode = activeNode.children.find(value => value.properties.name === data.objName + "");
                } else {
                    console.error("Cannot find node by objId or objCode = " + JSON.stringify(data));
                }

                if (!newActiveNode) {
                    console.error("Cannot find node by objId or objCode = " + JSON.stringify(data));
                    return;
                }

                if (newActiveNode) {
                    this.#systemController.setActiveNode(newActiveNode.id);
                    const activeNode = this.#systemController.getActiveNode();
                    let systemModel = this.#systemController.getPathByNodeId(activeNode.id);
                    this.#breadCrumbRender.render(systemModel);
                }
            }
        }
    }


    #goToNewStateById(nodeId) {
        const scope = this;
        const node = scope.#systemController.getNodeById(nodeId);
        const activeNode = this.#systemController.getActiveNode();
        if (activeNode.id !== node.id) {
            this.#systemController.setActiveNode(node.id);
            const activeNode = this.#systemController.getActiveNode();
            let systemModel = this.#systemController.getPathByNodeId(activeNode.id)
            scope.#breadCrumbRender.render(systemModel);
        }
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
}