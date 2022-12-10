import IeecloudAppRenderer from "../main-renderer/IeecloudAppRenderer.js";
import IeecloudSideBarController from "../../components/sidebar/sidebar-core/IeecloudSideBarController.js";
import IeecloudTopBarController from "../../components/topbar/topbar-core/IeecloudTopBarController.js";

export default class IeecloudAppController {
    #systemController;
    #schemeModel;

    constructor(schemeModel, systemController) {
        this.#schemeModel = schemeModel;
        this.#systemController = systemController;
    }

    init(containerId) {
        const mainRenderer = new IeecloudAppRenderer(containerId);
        const systemModel = this.#systemController.getTreeModel();
        mainRenderer.render(systemModel);

        const sideBarController = new IeecloudSideBarController(this.#schemeModel, this.#systemController);
        sideBarController.init(mainRenderer.sideBarContainerId, mainRenderer.contentContainerId);

        const topBarController = new IeecloudTopBarController(this.#systemController);
        topBarController.init(mainRenderer.topBarContainerId);
    }


}