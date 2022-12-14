import IeecloudContentRenderer from "../content-renderer/IeecloudContentRenderer.js";
import IeecloudBreadcrumbController from "../breadcrumb/breadcrumb-core/IeecloudBreadcrumbController.js";
import IeecloudPageContentController from "../page-content/page-content-core/IeecloudPageContentController.js";

export default class IeecloudContentController {
    #systemController;
    #schemeModel;

    constructor(schemeModel, systemController) {
        this.#schemeModel = schemeModel;
        this.#systemController = systemController;
    }

    init(containerId) {
        const contentRenderer = new IeecloudContentRenderer(containerId);
        const systemModel = this.#systemController.getTreeModel();
        contentRenderer.render(systemModel);

        const breadcrumbController = new IeecloudBreadcrumbController(this.#schemeModel, this.#systemController);
        breadcrumbController.init(contentRenderer.breadcrumbContainerId);

        const pageContentController = new IeecloudPageContentController(this.#systemController);
        pageContentController.init(contentRenderer.pageContentContainerId);
    }
}