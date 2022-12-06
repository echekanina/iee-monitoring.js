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
        this.#activeNode = this.#findRootElement(this.#schemeModel.rootElements);
        this.#breadCrumbRender = new IeecloudBreadCrumbRenderer(this, breadcrumbContainerId);
        let systemModel = this.#systemController.getPathByNodeId(this.#activeNode.id)
        this.#breadCrumbRender.render(systemModel);
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
                    newActiveNode = scope.#activeNode.children[0];
                }
                if (newActiveNode) {
                    scope.#activeNode = newActiveNode;
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