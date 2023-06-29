import IeecloudWidgetBodyRenderer from "./IeecloudWidgetBodyRenderer.js";
import IeecloudWidgetBodyEditRenderer from "./IeecloudWidgetBodyEditRenderer.js";

export default class IeecloudWidgetEditBodyController {
    #widgetBodyEditRenderer;
    #widgetBodyController;
    #systemController;
    constructor(widgetBodyController, systemController) {
        this.#widgetBodyController = widgetBodyController;
        this.#systemController = systemController;
    }

    init(containerId) {
        let activeNode = this.#systemController.getActiveNode();
        this.#widgetBodyEditRenderer = new IeecloudWidgetBodyEditRenderer(containerId, activeNode);
        this.#widgetBodyEditRenderer.render();
    }
}