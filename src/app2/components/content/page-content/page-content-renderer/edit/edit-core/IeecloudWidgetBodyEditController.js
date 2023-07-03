import IeecloudWidgetBodyEditRenderer from "../edit-renderer/IeecloudWidgetBodyEditRenderer.js";

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
        this.#widgetBodyEditRenderer = new IeecloudWidgetBodyEditRenderer(containerId, activeNode, 'NEW');
        this.#widgetBodyEditRenderer.render();
    }
}