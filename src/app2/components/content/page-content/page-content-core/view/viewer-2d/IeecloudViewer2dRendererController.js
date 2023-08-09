import IeecloudViewer2dRenderer from "../../../page-content-renderer/view/viewer-2d/IeecloudViewer2dRenderer.js";
import IeecloudViewer2dService from "./IeecloudViewer2dService.js";

export default class IeecloudViewer2dRendererController {
    #modelData;
    #systemController;
    #renderer;
    #service;

    constructor(modelData, systemController) {
        this.#modelData = modelData;
        this.#systemController = systemController;
    }

    init(container) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        const modelId = this.#systemController.modelId;
        this.#service = new IeecloudViewer2dService(nodeProps.dataService, modelId);

        this.#renderer = new IeecloudViewer2dRenderer(activeNode, this.#modelData);
        this.#renderer.render(container);

        this.#renderer.addEventListener('IeecloudViewer2dRenderer.selectNode', function (event) {
            const item = event.value;
            let selectedNode = activeNode.children.find(value => value.id === item.selectedNodeId);
            scope.#service.save2DCoordinateToStorage(selectedNode, item.stored2dCoordinates);
        });

        this.#service.readScheme(nodeProps, function (result) {
            scope.#service.readData(nodeProps, result, function (data) {
                scope.#renderer.render2D(data, container);
            });
        });


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