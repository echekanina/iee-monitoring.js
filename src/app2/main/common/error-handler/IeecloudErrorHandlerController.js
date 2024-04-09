import {IeecloudErrorHandlerRenderer} from "./IeecloudErrorHandlerRenderer.js";

export class IeecloudErrorHandlerController {
    #renderer;

    constructor() {

    }

    init(containerId) {

        this.#renderer = new IeecloudErrorHandlerRenderer(containerId);
        this.#renderer.render();

    }

    showError(code, errorMsg){
        this.#renderer.show(code, errorMsg);
    }
}