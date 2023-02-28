import IeecloudOptionsRenderer from "../options-renderer/IeecloudOptionsRenderer.js";
import IeecloudTreeStructureOptionsController from "./IeecloudTreeStructureOptionsController.js";
import IeecloudPageContentOptionsController from "./IeecloudPageContentOptionsController.js";

export default class IeecloudOptionsController {
    #systemController;
    #schemeModel;
    #contentPageOptionsController;
    #contentTreeStructureOptionsController;

    constructor(schemeModel, systemController) {
        this.#systemController = systemController;
        this.#schemeModel = schemeModel;
        this.#contentPageOptionsController = new IeecloudPageContentOptionsController(schemeModel);
        this.#contentTreeStructureOptionsController = new IeecloudTreeStructureOptionsController(schemeModel, this.#systemController);
    }

    init(containerId) {

        const scope = this;
        let contentOptionsRenderer = new IeecloudOptionsRenderer(containerId);
        contentOptionsRenderer.render();
        contentOptionsRenderer.addEventListener('IeecloudOptionsRenderer.resetDetailsOptions', function (event) {
            scope.#contentPageOptionsController.resetDetailsOptions();
        });
        contentOptionsRenderer.addEventListener('IeecloudOptionsRenderer.resetTreeOptions', function (event) {
            scope.#contentTreeStructureOptionsController.resetTreeOptions();
        });
        scope.#contentPageOptionsController.init(contentOptionsRenderer.detailsSettingContainer);
        scope.#contentTreeStructureOptionsController.init(contentOptionsRenderer.treeSettingContainer);
    }


    get layoutModel() {
        const scope = this;
        return scope.#contentPageOptionsController.layoutModel;
    }
    get treeSettings() {
        const scope = this;
        return scope.#contentTreeStructureOptionsController.treeSettings;
    }
}