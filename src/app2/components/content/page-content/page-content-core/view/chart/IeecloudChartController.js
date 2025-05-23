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

        scope.#service.readScheme(nodeProps, scope.#indicatorElement.startDateParam, scope.#indicatorElement.endDateParam, function (schemeResult) {
            scope.#renderer.renderChart({withEventsTooltip : true});
            scope.#renderer.addSpinner();
            scope.#loadDefaultDataWithPromises(promises, schemeResult, indicatorElement);
        });
    }

    #loadDefaultDataWithPromises(promises, schemeResult, indicatorElement) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        scope.#defaultStoreTypes?.forEach(itemStore => {
            if (itemStore.store.includes("journal.events")) {
                promises.push(scope.#parentService.readSchemePromise(nodeProps, itemStore.store)
                    .then(resp => ({ itemStore, response: resp }))
                );
                promises.push(scope.#service.readSingleLineData(itemStore, indicatorElement, nodeProps, schemeResult.schema, schemeResult.filterUrlParams,
                        itemStore.filter, itemStore.filterValues === "${node_code}" ? activeNode.properties.code : "")
                    .then(resp => ({ itemStore, response: resp }))
                );
            } else {
                promises.push(scope.#service.readSingleLineData(itemStore, indicatorElement, nodeProps, schemeResult.schema, schemeResult.filterUrlParams)
                    .then(resp => ({ itemStore, response: resp }))
                );
            }

        });

        Promise.all(promises)
            .then(results => Promise.all(
                results.map(({ itemStore, response }) =>
                    response.json().then(json => ({ itemStore, json }))
                )
            ))
            .then(results => scope.#collectLineData(results, schemeResult, indicatorElement)).then(chartLineDataMap => {
            // TODO: add clean data after refill data
            scope.#defaultStoreTypes.forEach(itemStore => {
                scope.clearEventStore(itemStore.id)
                scope.clearDataStore(itemStore.id)
            });

            for (let key in chartLineDataMap) {

                const itemStore = scope.#defaultStoreTypes.find(item => item.id === key);

                if (itemStore?.repoId?.includes("journal.events")) {
                    // const itemStore = scope.#defaultStoreTypes.find(item => item.repoId === key);
                    scope.#renderer.loadEventStore(itemStore, chartLineDataMap[key]);
                }else{
                    // render each line
                    scope.#renderer.loadDataStore(chartLineDataMap[key]);
                }

            }
            scope.#renderer.removeSpinner();
            // Do scale chart
            scope.#renderer.scaleAfterDataLoaded();
        });
    }

    applyDateRange(startDateParam, endDateParam) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;

        if (startDateParam) {
            scope.#indicatorElement.startDateParam = startDateParam;
        }

        if (endDateParam) {
            scope.#indicatorElement.endDateParam = endDateParam;
        }
        let promises = [];
        scope.#service.readScheme(nodeProps, scope.#indicatorElement.startDateParam, scope.#indicatorElement.endDateParam, function (schemeResult) {
            scope.#loadDefaultDataWithPromises(promises, schemeResult, scope.#indicatorElement);
        });
    }

    #collectLineData(responses, schemeResult, indicatorElement) {
        const scope = this;
        const chartLinesDataMap = {};
        responses.forEach(response => {

            var result = response.json;
            var itemStore = response.itemStore;

            // const itemStore = scope.#defaultStoreTypes.find(item => item.repoId === result.repoCode &&
            //     item.viewCode === result.viewCode);
            let mappedSingleData;
            if (itemStore && itemStore.store.includes("journal.events") && scope.#eventScheme) {
                mappedSingleData = scope.#parentService.mapEventData(result, scope.#eventScheme);

            }else if(!itemStore){
                scope.#eventScheme = result;
            }  else {
                mappedSingleData = scope.#service.mapData(result, schemeResult.schema, indicatorElement, itemStore);
            }

            if (mappedSingleData) {
                // chartLinesDataMap[itemStore.store + "-" + itemStore.viewCode] = mappedSingleData;
                // chartLinesDataMap[itemStore.store] = mappedSingleData;
                chartLinesDataMap[itemStore.id] = mappedSingleData;
            }
        });
        return chartLinesDataMap;
    }

    destroy() {
        this.#defaultStoreTypes = [];
        this.abortRequestIfPending();
        this.#renderer.destroy();
    }

    loadEventStore(itemStore, eventsData) {
        if (this.#renderer.loadEventStore) {
            this.#renderer.loadEventStore(itemStore, eventsData)
        }
    }

    addSpinner(){
        this.#renderer.addSpinner();
    }

    resetZoom() {
        this.#renderer.resetZoom();
    }

    screenshot(){
        this.#renderer.screenshot();
    }

    updateDefaultStoreTypes(storeTypes) {
        this.#defaultStoreTypes = storeTypes;
    }

    loadDataStore(itemStore, startDateParam, endDateParam) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;

        if (startDateParam) {
            scope.#indicatorElement.startDateParam = startDateParam;
        }

        if (endDateParam) {
            scope.#indicatorElement.endDateParam = endDateParam;
        }

        scope.#service.readScheme(nodeProps,  scope.#indicatorElement.startDateParam, scope.#indicatorElement.endDateParam, function (result) {
            scope.#service.readSingleLineDataAsync(itemStore, nodeProps, result.schema, result.filterUrlParams, scope.#indicatorElement, function (singleData) {
                scope.#renderer.loadDataStore(singleData);
                scope.#renderer.scaleAfterDataLoaded();
                scope.#renderer.removeSpinner();
            });
        });
    }

    loadNewApiDataStore(criteriaParams, startDateParam, endDateParam) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        scope.#renderer.addSpinner();
        scope.#service.readNewApiScheme(nodeProps.indicatorDataRepoId, criteriaParams, startDateParam, endDateParam, function (result) {
            scope.#service.readSingleLineNewApiDataAsync(nodeProps.indicatorDataRepoId, criteriaParams, result.schema, result.filterUrlParams, function (singleData) {
                scope.#renderer.loadDataStoreWithPrevSettings(singleData, criteriaParams);
                scope.#renderer.scaleAfterDataLoaded();
                scope.#renderer.removeSpinner();
            });
        });
    }

    cleanChart(){
        this.#renderer.cleanChart();
    }

    abortRequestIfPending(){
        this.#service.abortRequest();
        this.#renderer.removeSpinner()
    }

    rebuildAbortController(){
        this.#service.rebuildAbortController();
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

    hideShowChartLine(resultLineData, value) {
        if (this.#renderer.hideShowChartLine) {
            this.#renderer.hideShowChartLine(resultLineData, value);
            this.#renderer.scaleAfterDataLoaded();
        }
    }

}