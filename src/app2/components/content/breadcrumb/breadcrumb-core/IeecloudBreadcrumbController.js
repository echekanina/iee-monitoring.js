import IeecloudBreadCrumbRenderer from "../breadcrumb-renderer/IeecloudBreadCrumbRenderer.js";
import {eventBus} from "../../../../main/index.js";

export default class IeecloudBreadcrumbController {
    #systemController;
    #schemeModel;
    #activeNode;
    #breadCrumbRender;

    constructor(schemeModel, systemController) {
        this.#schemeModel = schemeModel;
        this.#systemController = systemController;
    }

    init(breadcrumbContainerId) {
        const scope = this;
        this.#activeNode = this.#findRootElement(this.#schemeModel.rootElements);
        this.#systemController.setActiveNode(this.#activeNode.id);
        this.#breadCrumbRender = new IeecloudBreadCrumbRenderer(this, breadcrumbContainerId);
        let systemModel = this.#systemController.getPathByNodeId(this.#activeNode.id)
        this.#breadCrumbRender.render(systemModel);

        this.#systemController.on('tree.activeNodeSet', function (node) {
            scope.#activeNode = scope.#systemController.getActiveNode();
            let systemModel = scope.#systemController.getPathByNodeId(scope.#activeNode.id)
            scope.#breadCrumbRender.render(systemModel);
            eventBus.emit('IeecloudBreadCrumbRenderer.nodeChanged', scope.#activeNode, false);
        });
    }

    get activeNode() {
        return this.#activeNode;
    }

    goToNewState(data) {
        const scope = this;
        if (scope.#activeNode.id === data.activeNode.id) {
            // go to child node
            if (scope.#activeNode.hasChildren()) {
                let newActiveNode = scope.#activeNode.children.find(value => value.properties.groupId === data.groupId + "");

                if (!newActiveNode) {
                    console.error("Cannot find node by groupId = " + data.groupId)
                    return;
                }

                if (newActiveNode) {
                    scope.#activeNode = newActiveNode;
                    this.#systemController.setActiveNode(this.#activeNode.id);
                    let systemModel = this.#systemController.getPathByNodeId(this.#activeNode.id);
                    this.#breadCrumbRender.render(systemModel);
                    eventBus.emit('IeecloudBreadCrumbRenderer.nodeChanged', scope.#activeNode, false);
                }
            }
        }
    }


    goToNewStateById(nodeId) {
        const scope = this;
        const node = scope.#systemController.getNodeById(nodeId);
        if (scope.#activeNode.id !== node.id) {
            scope.#activeNode = node;
            this.#systemController.setActiveNode(this.#activeNode.id);
            let systemModel = this.#systemController.getPathByNodeId(this.#activeNode.id)
            scope.#breadCrumbRender.render(systemModel);
            eventBus.emit('IeecloudBreadCrumbRenderer.nodeChanged', scope.#activeNode, false);
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