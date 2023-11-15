import {IeecloudChartPairRenderer} from "../../../page-content-renderer/view/chart-pair/IeecloudChartPairRenderer.js";
import IeecloudChartPairService from "./IeecloudChartPairService.js";
import IeecloudChartService from "../chart/IeecloudChartService.js";
import IeecloudChartController from "../chart/IeecloudChartController.js";

export default class IeecloudChartPairController {
    #systemController;
    #renderer;
    #service;

    #chartControllers = [];


    constructor(systemController) {
        this.#systemController = systemController;
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
                        if (indicatorsTml instanceof Array) {

                            if (property.type === 'real' && !property.code.includes('_')) {
                                let chartIndicator = [];
                                indicatorsTml.forEach(function (elemTmpl) {

                                    let obj = {};
                                    for (let key in elemTmpl) {
                                        if (key === "color") {
                                            obj[key] = elemTmpl[key];
                                            continue;
                                        }
                                        if (property[elemTmpl[key]]) {
                                            obj[key] = property[elemTmpl[key]]
                                        } else {
                                            const words = elemTmpl[key].split('_');
                                            let foundProp = result.schema.properties.find(function (prop) {

                                                return prop[words[0]] === property[words[0]] + '_' + words[1];
                                            });
                                            if (foundProp) {
                                                obj["prop"] = foundProp;
                                            }
                                            if (foundProp && foundProp.hasOwnProperty(key)) {
                                                obj[key] = foundProp[key];
                                            } else {
                                                obj[words[0]] = obj["prop"][words[0]];
                                            }
                                        }

                                    }
                                    delete obj["prop"];
                                    obj.title = yTitle;
                                    obj.zoomLimit = zoomLimit;
                                    chartIndicator.push(obj);


                                })

                                chartIndicators.push(chartIndicator);
                            }

                        } else if (indicatorsTml instanceof Object) {

                            if (property.type === 'real') {
                                let chartIndicator = [];
                                let obj = {};
                                for (let key in indicatorsTml) {
                                    if (property[indicatorsTml[key]]) {
                                        obj[key] = property[indicatorsTml[key]]
                                    }
                                }
                                obj.title = yTitle;
                                obj.zoomLimit = zoomLimit;
                                chartIndicator.push(obj);

                                chartIndicators.push(chartIndicator);
                            }
                        }
                    }

                })

                chartIndicators.forEach(function (indicatorsElement) {
                    let chartController = new IeecloudChartController(scope.#systemController, chartService);
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

    loadEventStore(itemStore) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        // TODO : add server data
        if(itemStore.event === "journal.chart"){
            console.log("load chart line mock");

            if (scope.#chartControllers && scope.#chartControllers.length > 0) {
                const data = {};
                scope.#chartControllers.forEach(chartCtr => chartCtr.loadDataStore(itemStore, data))
            }
            return;

        }
        scope.#service.readScheme(nodeProps, itemStore.event, function (result) {
            scope.#service.readData(nodeProps, result.schema, itemStore.event, function (data) {
                if (scope.#chartControllers && scope.#chartControllers.length > 0) {
                    scope.#chartControllers.forEach(chartCtr => chartCtr.loadEventStore(itemStore, data))
                }
            });
        });
    }


    clearEventStore(storeEventType) {
        const scope = this;
        // TODO : add server data
        if(storeEventType === "journal.chart"){
            console.log("clear chart line mock");

            if (scope.#chartControllers && scope.#chartControllers.length > 0) {
                scope.#chartControllers.forEach(chartCtr => chartCtr.clearDataStore(storeEventType))
            }
            return;

        }
        if (scope.#chartControllers && scope.#chartControllers.length > 0) {
            scope.#chartControllers.forEach(chartCtr => chartCtr.clearEventStore(storeEventType))
        }
    }


}