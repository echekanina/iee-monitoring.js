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
        const activeNode = this.#systemController.getActiveNode();
        scope.#breadCrumbRender = new IeecloudBreadCrumbRenderer();
        let systemModel = this.#systemController.getPathByNodeId(activeNode.id)
        scope.#breadCrumbRender.render(systemModel, breadcrumbContainerId);

        scope.#breadCrumbRender.addEventListener('IeecloudBreadCrumbRenderer.itemClicked', function (event) {
            const nodeId = event.value;
            const data = {objId: nodeId}
            eventBus.emit('IeecloudTableRenderer.rowClick', data, false);

        });
    }

    buildContent(breadcrumbContainerId) {
        const scope = this;
        const activeNode = scope.#systemController.getActiveNode();
        let systemModel = scope.#systemController.getPathByNodeId(activeNode.id)
        scope.#breadCrumbRender.render(systemModel, breadcrumbContainerId);
    }
}