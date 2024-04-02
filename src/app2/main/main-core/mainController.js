import IeecloudAppRenderer from "../main-renderer/IeecloudAppRenderer.js";
import IeecloudSideBarController from "../../components/sidebar/sidebar-core/IeecloudSideBarController.js";
import IeecloudTopBarController from "../../components/topbar/topbar-core/IeecloudTopBarController.js";

export default class IeecloudAppController {
    #systemController;
    #schemeModel;
    #menuTreeSettings;

    constructor(schemeModel, systemController, menuTreeSettings) {
        this.#schemeModel = schemeModel;
        this.#systemController = systemController;
        this.#menuTreeSettings = menuTreeSettings;
    }

    init(containerId) {
        const mainRenderer = new IeecloudAppRenderer(containerId);
        const systemModel = this.#systemController.getTreeModel();
        mainRenderer.render(systemModel);

        const sideBarController = new IeecloudSideBarController(this.#schemeModel, this.#systemController,
            this.#menuTreeSettings);
        sideBarController.init(mainRenderer.sideBarContainerId, mainRenderer.contentContainerId,
            mainRenderer.treeContainerId, mainRenderer.contentOptionsContainerId);

        const topBarController = new IeecloudTopBarController(this.#systemController);
        topBarController.init(mainRenderer.topBarContainerId);

    }
}