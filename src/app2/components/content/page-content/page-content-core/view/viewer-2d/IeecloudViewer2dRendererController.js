import { upperFirst } from "lodash-es";
import IeecloudViewer2dRenderer from "../../../page-content-renderer/view/viewer-2d/IeecloudViewer2dRenderer.js";
import IeecloudViewer2dService from "./IeecloudViewer2dService.js";
import {eventBus} from "../../../../../../main/index.js";

export default class IeecloudViewer2dRendererController {
    #modelData;
    #systemController;
    #renderer;
    #service;
    #tooltipIndicator;
    #tooltipTypeIndicator;
    #tooltipFuncAggregation

    constructor(modelData, systemController, tooltipIndicator, tooltipTypeIndicator, tooltipFuncAggregation) {
        this.#modelData = modelData;
        this.#systemController = systemController;
        this.#tooltipIndicator = tooltipIndicator;
        this.#tooltipTypeIndicator = tooltipTypeIndicator;
        this.#tooltipFuncAggregation = tooltipFuncAggregation;
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
                scope.#service.readIndicatorsScheme(nodeProps.code, scope.#tooltipIndicator, scope.#tooltipTypeIndicator, scope.#tooltipFuncAggregation, function (indicatorsScheme) {
                    scope.#service.readIndicatorsData(nodeProps.code, scope.#tooltipIndicator, scope.#tooltipTypeIndicator, scope.#tooltipFuncAggregation, indicatorsScheme, function (tooltipData) {
                        scope.#renderer.render2D(data, container, tooltipData);
                    });
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

    changeIndicator(tooltipIndicator, tooltipIndicatorType, tooltipFuncAggregation, list, indicatorName){
        const scope = this;
        this.#tooltipIndicator = tooltipIndicator;
        this.#tooltipTypeIndicator = tooltipIndicatorType;
        this.#tooltipFuncAggregation = tooltipFuncAggregation;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        if (this.#renderer.changeIndicator) {
            scope.#service.readIndicatorsScheme(nodeProps.code, scope.#tooltipIndicator, scope.#tooltipTypeIndicator, scope.#tooltipFuncAggregation, function (indicatorsScheme) {
                scope.#service.readIndicatorsData(nodeProps.code, scope.#tooltipIndicator, scope.#tooltipTypeIndicator, scope.#tooltipFuncAggregation, indicatorsScheme, function (tooltipData) {
                    scope.#renderer.changeIndicator(tooltipData);
                    const value = eval('tooltip' + upperFirst(indicatorName));
                    eventBus.emit('IeecloudViewer2dRendererController.'+ indicatorName + 'Changed', {value : value, list: list}, false);
                });



            });
            
        }
    }


}