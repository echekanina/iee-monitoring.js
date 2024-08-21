import IeecloudOptionsRenderer from "../options-renderer/IeecloudOptionsRenderer.js";
import IeecloudTreeStructureOptionsController from "./IeecloudTreeStructureOptionsController.js";
import IeecloudPageContentOptionsController from "./IeecloudPageContentOptionsController.js";

export default class IeecloudOptionsController {
    #systemController;
    #schemeModel;
    #contentPageOptionsController;
    #contentTreeStructureOptionsController;

    constructor(treeSettings, layoutJsonFile, detailsSettings,  schemeModel, systemController) {
        this.#systemController = systemController;
        this.#schemeModel = schemeModel;
        const storedUserSettingsKeyAddition = '_' + import.meta.env.ORG_CODE + '_' + import.meta.env.APP_CODE + '_' + import.meta.env.ENV + '_' + __KEY_OPTIONS__ + '_' + this.#systemController.modelId;
        this.#contentPageOptionsController = new IeecloudPageContentOptionsController(layoutJsonFile, schemeModel, detailsSettings, storedUserSettingsKeyAddition);
        this.#contentTreeStructureOptionsController = new IeecloudTreeStructureOptionsController(treeSettings, schemeModel, this.#systemController, storedUserSettingsKeyAddition);
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

        contentOptionsRenderer.addEventListener('IeecloudOptionsRenderer.resetAllUserUISettings', function (event) {
            const exclude = 'access_token_' + '_' + import.meta.env.ENV + '_' + __KEY_OPTIONS__;

            for (let i = 0; i < localStorage.length; i++){
                let key = localStorage.key(i);

                if (exclude.indexOf(key) === -1) {
                    localStorage.removeItem(key);
                }
            }
            document.location.reload();
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