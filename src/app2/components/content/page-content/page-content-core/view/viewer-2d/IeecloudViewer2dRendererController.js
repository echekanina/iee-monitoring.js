import IeecloudViewer2dRenderer from "../../../page-content-renderer/view/viewer-2d/IeecloudViewer2dRenderer.js";
import IeecloudViewer2dService from "./IeecloudViewer2dService.js";

export default class IeecloudViewer2dRendererController {
    #modelData;
    #systemController;
    #renderer;
    #service;
    #tooltipIndicator;

    constructor(modelData, systemController, tooltipIndicator) {
        this.#modelData = modelData;
        this.#systemController = systemController;
        this.#tooltipIndicator = tooltipIndicator;
    }

    init(container) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        const modelId = this.#systemController.modelId;
        this.#service = new IeecloudViewer2dService(modelId);

        let renderModel = import.meta.env.APP_STATIC_STORAGE + "/" + nodeProps.viewer2dModel;

        if (this.#modelData !== "default") {
            renderModel = renderModel.replace(".png", this.#modelData + ".png");
        }

        this.#renderer = new IeecloudViewer2dRenderer(activeNode, this.#modelData, renderModel, scope.#tooltipIndicator);
        this.#renderer.render(container);

        this.#renderer.addEventListener('IeecloudViewer2dRenderer.selectNode', function (event) {
            const item = event.value;
            let selectedNode = activeNode.children.find(value => value.id === item.selectedNodeId);
            scope.#service.save2DCoordinateToStorage(selectedNode, item.stored2dCoordinates);
            scope.#renderer.recalculateSensorPosition(selectedNode, item.stored2dCoordinates);
        });

        this.#renderer.addEventListener('IeecloudViewer2dRenderer.addNewSensor', function (event) {
            scope.#service.readScheme(nodeProps, function (result) {
                scope.#service.readData(nodeProps, result, function (data) {
                    const childNode = event.value;
                    let sensorItem = data.find(value => value.id === parseInt(childNode.id));
                    if (sensorItem) {
                        scope.#renderer.addNewSensor(sensorItem);
                    }
                });
            });
        });

        this.#service.readScheme(nodeProps, function (result) {
            scope.#service.readData(nodeProps, result, function (data) {
                scope.#service.getIndicatorData(nodeProps.code, scope.#tooltipIndicator, function(tooltipData){
                    scope.#renderer.render2D(data, container, tooltipData);
                });

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

    changeIndicator(indicator){
        const scope = this;
        this.#tooltipIndicator = indicator;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        if (this.#renderer.changeIndicator) {
            scope.#service.getIndicatorData(nodeProps.code, scope.#tooltipIndicator, function (tooltipData) {
                scope.#renderer.changeIndicator(tooltipData);
            });
        }
    }


}