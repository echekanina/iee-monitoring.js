import {IeecloudErrorHandlerRenderer} from "./IeecloudErrorHandlerRenderer.js";

export class IeecloudErrorHandlerController {
    #renderer;
    #appThemeSettings;

    constructor(appThemeSettings) {
        this.#appThemeSettings = appThemeSettings;

    }

    init(containerId) {

        this.#renderer = new IeecloudErrorHandlerRenderer(containerId, this.#appThemeSettings);
        this.#renderer.render();

    }

    showError(code, errorMsg, isNetwork){
        this.#renderer.show(code, errorMsg, isNetwork);
    }
}