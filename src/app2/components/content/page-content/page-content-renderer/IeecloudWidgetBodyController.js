import IeecloudWidgetBodyRenderer from "./IeecloudWidgetBodyRenderer.js";

export default class IeecloudWidgetBodyController {
    #widgetContentModel;
    #systemController;
    #widgetBodyRenderer;

    constructor(widgetContent, systemController) {
        this.#widgetContentModel = widgetContent;
        this.#systemController = systemController;
    }

    init(containerId) {
        let scope = this;
        let activeNode = this.#systemController.getActiveNode();
        this.#widgetBodyRenderer = new IeecloudWidgetBodyRenderer(containerId, this.#widgetContentModel, activeNode, this.#systemController);
        this.#widgetBodyRenderer.render();
    }

    destroy(){
        let scope = this;
        scope.#widgetBodyRenderer.destroy();
    }

    switchView(view, modelData) {
        if (view && view !== this.#widgetBodyRenderer.viewType) {
            this.#widgetBodyRenderer.viewType = view;
            this.#widgetBodyRenderer.render();
            return;
        }

        if (modelData && modelData !== this.#widgetBodyRenderer.modelData) {
            this.#widgetBodyRenderer.modelData = modelData;
            this.#widgetBodyRenderer.render();
        }
    }

    get viewType() {
        return this.#widgetBodyRenderer.viewType;
    }

    get modelData() {
        return this.#widgetBodyRenderer.modelData;
    }
}