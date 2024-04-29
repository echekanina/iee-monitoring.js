import IeecloudAppRenderer from "../main-renderer/IeecloudAppRenderer.js";
import IeecloudSideBarController from "../../components/sidebar/sidebar-core/IeecloudSideBarController.js";
import IeecloudTopBarController from "../../components/topbar/topbar-core/IeecloudTopBarController.js";

export default class IeecloudAppController {
    #systemController;
    #schemeModel;
    #menuTreeSettings;
    #userProfile;
    #loginController;

    constructor(schemeModel, systemController, menuTreeSettings, userProfile, loginController) {
        this.#schemeModel = schemeModel;
        this.#systemController = systemController;
        this.#menuTreeSettings = menuTreeSettings;
        this.#userProfile = userProfile;
        this.#loginController = loginController;
    }

    init(containerId) {
        const mainRenderer = new IeecloudAppRenderer(containerId);
        mainRenderer.render();

        const sideBarController = new IeecloudSideBarController(this.#schemeModel, this.#systemController,
            this.#menuTreeSettings);
        sideBarController.init(mainRenderer.sideBarContainerId, mainRenderer.contentContainerId,
            mainRenderer.treeContainerId, mainRenderer.contentOptionsContainerId);

        const topBarController = new IeecloudTopBarController(this.#systemController);
        topBarController.init(mainRenderer.topBarContainerId, this.#userProfile, this.#loginController);

    }
}