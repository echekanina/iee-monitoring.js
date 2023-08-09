import IeecloudChartRenderer from "../../../page-content-renderer/view/chart/IeecloudChartRenderer.js";

export default class IeecloudChartController {
    #systemController;
    #service;
    #renderer;

    constructor(systemController, chartService) {
        this.#systemController = systemController;
        this.#service = chartService;
    }

    init(indicatorElement, container) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        this.#renderer = new IeecloudChartRenderer(activeNode, indicatorElement);
        this.#renderer.render(container);

        const nodeProps = activeNode.properties;

        scope.#service.readScheme(nodeProps, function (result) {
            scope.#service.readData(nodeProps, result.schema, result.filterUrlParams, indicatorElement, function (data) {
                scope.#renderer.renderChart(data);
            });
        });
    }

    destroy() {
        this.#renderer.destroy();
    }

    loadEventStore(itemStore, eventsData) {
        if (this.#renderer.loadEventStore) {
            this.#renderer.loadEventStore(itemStore, eventsData)
        }
    }

    clearEventStore(storeEventType) {
        if (this.#renderer.clearEventStore) {
            this.#renderer.clearEventStore(storeEventType);
        }
    }

}