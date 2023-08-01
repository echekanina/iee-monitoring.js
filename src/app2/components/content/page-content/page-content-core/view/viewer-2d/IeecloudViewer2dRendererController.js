import IeecloudViewer2dRenderer from "../../../page-content-renderer/view/viewer-2d/IeecloudViewer2dRenderer.js";

export default class IeecloudViewer2dRendererController {
    #modelData;
    #systemController;
    #renderer;

    constructor(modelData, systemController) {
        this.#modelData = modelData;
        this.#systemController = systemController;
    }

    init(container) {
        let activeNode = this.#systemController.getActiveNode();
        this.#renderer = new IeecloudViewer2dRenderer(activeNode, this.#modelData);
        this.#renderer.render(container);
    }

    destroy() {
        this.#renderer.destroy();
    }

    fullScreen() {
        if (this.#renderer.fullScreen) {
            this.#renderer.fullScreen();
        }
    }

    toggleAddChildNodes(flag, containers) {
        const scope = this;
        if (scope.#renderer && scope.#renderer.toggleAddChildNodes) {
            scope.#renderer.toggleAddChildNodes(flag, containers);
        }
    }


}