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

        let promises = [];

        scope.#service.readScheme(nodeProps, function (schemeResult) {
            scope.#renderer.renderChart();
            scope.#defaultStoreTypes.forEach(itemStore => {
                promises.push(scope.#service.readSingleLineData(itemStore, nodeProps, schemeResult.schema, schemeResult.filterUrlParams));
            });

            Promise.all(promises).then(responses => {
                    return Promise.all(responses.map(r => r.json()))
                }
            )

                .then(responses => scope.#collectLineData(responses, schemeResult, indicatorElement)).then(chartLineDataMap => {
                for (let key in chartLineDataMap) {
                    const itemStore = scope.#defaultStoreTypes.find(item => item.repoId === key);
                    // render each line
                    scope.#renderer.loadDataStore(itemStore, chartLineDataMap[key]);
                }
                // Do scale chart
                scope.#renderer.scaleAfterDataLoaded();
            });
        });
    }

    #collectLineData(responses, schemeResult, indicatorElement) {
        const scope = this;
        const chartLinesDataMap = {};
        responses.forEach(result => {
            const itemStore = scope.#defaultStoreTypes.find(item => item.repoId === result.repoCode);
            let mappedSingleData = scope.#service.mapData(result, schemeResult.schema, indicatorElement, itemStore.color);
            if (mappedSingleData) {
                chartLinesDataMap[itemStore.store] = mappedSingleData;
            }
        });
        return chartLinesDataMap;
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