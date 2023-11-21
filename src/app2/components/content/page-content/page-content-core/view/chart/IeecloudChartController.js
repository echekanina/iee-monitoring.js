import IeecloudChartRenderer from "../../../page-content-renderer/view/chart/IeecloudChartRenderer.js";

export default class IeecloudChartController {
    #systemController;
    #service;
    #renderer;
    #defaultStoreTypes;
    #indicatorElement;

    constructor(defaultStoreTypes, systemController, chartService) {
        this.#defaultStoreTypes = defaultStoreTypes;
        this.#systemController = systemController;
        this.#service = chartService;
    }

    init(indicatorElement, container) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        this.#renderer = new IeecloudChartRenderer(activeNode, indicatorElement);
        this.#renderer.render(container);
        this.#indicatorElement = indicatorElement;

        const nodeProps = activeNode.properties;

        scope.#service.readScheme(nodeProps, function (result) {
            scope.#renderer.renderChart();
            scope.#defaultStoreTypes.forEach(itemStore => {
                scope.#service.readSingleLineData(itemStore, nodeProps, result.schema, result.filterUrlParams, indicatorElement, function (singleData) {
                    scope.#renderer.loadDataStore(itemStore, singleData);
                });
            });
        });



        // let promises = [];
        //
        // scope.#service.readScheme(nodeProps, function (result) {
        //         scope.#renderer.renderChart();
        //         console.log(scope.#defaultStoreTypes)
        //     for (let k = 0; k < scope.#defaultStoreTypes.length; k++) {
        //         const itemStore = scope.#defaultStoreTypes[k];
        //
        //         promises.push()
        //
        //         scope.#service.readSingleLineData(itemStore, nodeProps, result.schema, result.filterUrlParams, indicatorElement, function (singleData) {
        //             scope.#renderer.loadDataStore(itemStore, singleData, k);
        //         });
        //     }
        //
        //     // scope.#renderer.scaleAfterDefaultDataLoaded();
        // });
    }

    destroy() {
        this.#renderer.destroy();
    }

    loadEventStore(itemStore, eventsData) {
        if (this.#renderer.loadEventStore) {
            this.#renderer.loadEventStore(itemStore, eventsData)
        }
    }

    loadDataStore(itemStore) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        scope.#service.readScheme(nodeProps, function (result) {
            scope.#service.readSingleLineData(itemStore, nodeProps, result.schema, result.filterUrlParams, scope.#indicatorElement, function (singleData) {
                scope.#renderer.loadDataStore(itemStore, singleData);
            });
        });
    }

    clearEventStore(storeEventType) {
        if (this.#renderer.clearEventStore) {
            this.#renderer.clearEventStore(storeEventType);
        }
    }

    clearDataStore(storeEventType) {
        if (this.#renderer.clearDataStore) {
            this.#renderer.clearDataStore(storeEventType);
        }
    }

}