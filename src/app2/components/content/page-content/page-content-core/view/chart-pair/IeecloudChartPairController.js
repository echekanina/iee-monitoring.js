import {IeecloudChartPairRenderer} from "../../../page-content-renderer/view/chart-pair/IeecloudChartPairRenderer.js";
import IeecloudChartPairService from "./IeecloudChartPairService.js";
import IeecloudChartService from "../chart/IeecloudChartService.js";
import IeecloudChartController from "../chart/IeecloudChartController.js";

export default class IeecloudChartPairController {
    #systemController;
    #renderer;
    #service;

    #chartControllers = [];
    #defaultStoreTypes;


    constructor(defaultStoreTypes, systemController) {
        this.#systemController = systemController;
        this.#defaultStoreTypes = defaultStoreTypes;
    }


    init(container) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        this.#service = new IeecloudChartPairService();


        this.#service.readSettingsFile(import.meta.env.APP_SERVER_URL, import.meta.env.VITE_CONTENT_CHART_LAYOUT, function (chartLayout) {
            scope.#renderer = new IeecloudChartPairRenderer(activeNode, chartLayout);
            scope.#renderer.render(container);

            const chartService = new IeecloudChartService();

            let chartIndicators = [];

            chartService.readScheme(nodeProps, function (result) {

                result.schema.properties.forEach(function (property) {
                    let indicatorsTemplate = chartLayout[nodeProps.type];
                    if (indicatorsTemplate) {
                        let indicatorsTml = indicatorsTemplate.indicatorsTml;
                        let yTitle = indicatorsTemplate.title;
                        let zoomLimit = indicatorsTemplate.zoomLimit;

                        if (indicatorsTml instanceof Object && !property.code.includes('_')) {

                            if (property.type === 'real') {
                                let obj = {};
                                for (let key in indicatorsTml) {
                                    if (property[indicatorsTml[key]]) {
                                        obj[key] = property[indicatorsTml[key]]
                                    }
                                }
                                obj.title = yTitle;
                                obj.zoomLimit = zoomLimit;
                                chartIndicators.push(obj);
                            }
                        }
                    }

                })

                chartIndicators.forEach(function (indicatorsElement) {
                    let chartController = new IeecloudChartController(scope.#defaultStoreTypes, scope.#systemController, chartService);
                    chartController.init(indicatorsElement, scope.#renderer.pairContainer);
                    scope.#chartControllers.push(chartController);
                });
            });

        });
    }

    destroy() {
        const scope = this;
        scope.#renderer.destroy();

        if (scope.#chartControllers && scope.#chartControllers.length > 0) {
            scope.#chartControllers.forEach(chartCtr => chartCtr.destroy())
        }
        scope.#chartControllers = [];
    }

    fullScreen() {
        if (this.#renderer.fullScreen) {
            this.#renderer.fullScreen();
        }
    }

    loadStore(itemStore) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;

        if (itemStore.store.includes("journal.events")) {
            scope.#service.readScheme(nodeProps, itemStore.store, function (result) {
                scope.#service.readData(nodeProps, result.schema, itemStore.store, function (data) {
                    if (scope.#chartControllers && scope.#chartControllers.length > 0) {
                        scope.#chartControllers.forEach(chartCtr => chartCtr.loadEventStore(itemStore, data))
                    }
                }, itemStore.filter, itemStore.filterValues === "${node_code}" ? activeNode.properties.code : "");
            });
            return;
        }

        if (scope.#chartControllers && scope.#chartControllers.length > 0) {
            scope.#chartControllers.forEach(chartCtr => chartCtr.loadDataStore(itemStore));
        }

    }


    clearStore(storeType) {
        const scope = this;

        if (storeType.includes("journal.events")) {
            if (scope.#chartControllers && scope.#chartControllers.length > 0) {
                scope.#chartControllers.forEach(chartCtr => chartCtr.clearEventStore(storeType))
            }
            return;
        }

        if (scope.#chartControllers && scope.#chartControllers.length > 0) {
            scope.#chartControllers.forEach(chartCtr => chartCtr.clearDataStore(storeType))
        }

    }


}