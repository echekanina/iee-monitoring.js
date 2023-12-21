import IeecloudChartRenderer from "../../../page-content-renderer/view/chart/IeecloudChartRenderer.js";

export default class IeecloudChartController {
    #systemController;
    #service;
    #renderer;
    #defaultStoreTypes;
    #indicatorElement;
    #chartCountMoreThanOne;
    #parentService;

    #eventScheme;

    constructor(defaultStoreTypes, systemController, chartService, chartCountMoreThanOne, parentService) {// TODO:remove parent from here
        this.#defaultStoreTypes = defaultStoreTypes;
        this.#systemController = systemController;
        this.#service = chartService;
        this.#parentService = parentService;
        this.#chartCountMoreThanOne = chartCountMoreThanOne;
    }

    init(indicatorElement, container) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        this.#renderer = new IeecloudChartRenderer(activeNode, indicatorElement, scope.#chartCountMoreThanOne);
        this.#renderer.render(container);
        this.#indicatorElement = indicatorElement;

        const nodeProps = activeNode.properties;

        if(!scope.#defaultStoreTypes || scope.#defaultStoreTypes.length === 0){
            scope.#renderer.renderChart({withEventsTooltip : false});
            return;
        }

        let promises = [];



        scope.#service.readScheme(nodeProps, function (schemeResult) {
            scope.#renderer.renderChart({withEventsTooltip : true});
            scope.#defaultStoreTypes?.forEach(itemStore => {
                if (itemStore.store.includes("journal.events")) {
                    promises.push(scope.#parentService.readSchemePromise(nodeProps, itemStore.store));
                    promises.push(scope.#service.readSingleLineData(itemStore, nodeProps, schemeResult.schema, schemeResult.filterUrlParams,
                        itemStore.filter, itemStore.filterValues === "${node_code}" ? activeNode.properties.code : ""));
                }else{
                    promises.push(scope.#service.readSingleLineData(itemStore, nodeProps, schemeResult.schema, schemeResult.filterUrlParams));
                }

            });

            Promise.all(promises).then(responses => {
                    return Promise.all(responses.map(r => r.json()))
                }
            )

                .then(responses => scope.#collectLineData(responses, schemeResult, indicatorElement)).then(chartLineDataMap => {
                for (let key in chartLineDataMap) {

                    if (key.includes("journal.events")) {
                        const itemStore = scope.#defaultStoreTypes.find(item => item.repoId === key);
                        scope.#renderer.loadEventStore(itemStore, chartLineDataMap[key]);
                    }else{
                        // render each line
                        scope.#renderer.loadDataStore(chartLineDataMap[key]);
                    }

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
            let mappedSingleData;
            if (itemStore && itemStore.store.includes("journal.events") && scope.#eventScheme) {
                mappedSingleData = scope.#parentService.mapEventData(result, scope.#eventScheme);

            }else if(!itemStore){
                scope.#eventScheme = result;
            }  else {
                mappedSingleData = scope.#service.mapData(result, schemeResult.schema, indicatorElement, itemStore);
            }

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
            scope.#service.readSingleLineDataAsync(itemStore, nodeProps, result.schema, result.filterUrlParams, scope.#indicatorElement, function (singleData) {
                scope.#renderer.loadDataStore(/*itemStore, */singleData);
                scope.#renderer.scaleAfterDataLoaded();
            });
        });
    }

    loadNewApiDataStore(criteriaParams) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        scope.#service.readNewApiScheme(nodeProps.repoId, criteriaParams, function (result) {
            scope.#service.readSingleLineNewApiDataAsync(nodeProps.repoId, criteriaParams, result.schema, result.filterUrlParams, function (singleData) {
                scope.#renderer.loadDataStore(singleData);
                scope.#renderer.scaleAfterDataLoaded();
            });
        });
    }

    clearEventStore(itemStoreId) {
        if (this.#renderer.clearEventStore) {
            this.#renderer.clearEventStore(itemStoreId);
        }
    }

    clearDataStore(itemStoreId) {
        if (this.#renderer.clearDataStore) {
            this.#renderer.clearDataStore(itemStoreId);
            this.#renderer.scaleAfterDataLoaded();
        }
    }

}