import IeecloudChartService from "../chart/IeecloudChartService.js";
import IeecloudChartController from "../chart/IeecloudChartController.js";
import IeecloudChartOneService from "./IeecloudChartOneService.js";
import {IeecloudChartOneRenderer} from "../../../page-content-renderer/view/chart-new/IeecloudChartOneRenderer.js";
import {Modal} from "bootstrap";
import IeecloudContentService from "../../../../content-core/IeecloudContentService.js";
import {IeecloudTreeInspireImpl} from "ieecloud-tree";
import IeecloudTreeLightController from "../../../../../tree/tree-core/IeecloudTreeLightController.js";
import IeecloudOptionsController from "../../../../../options/options-core/IeecloudOptionsController.js";
import IeecloudTableEditRenderer from "../../../page-content-renderer/view/table-edit/IeecloudTableEditRenderer.js";
import IeecloudAppUtils from "../../../../../../main/utils/IeecloudAppUtils.js";

export default class IeecloudChartOneController {
    #systemController;
    #renderer;
    #service;

    #chartControllers = [];
    #criteriaModal;
    #contentModelService;
    #treeCriteriaSystemController;
    #chartService;
    #tableCriteriaRenderer;
    #treeLightController;
    #startDateParam;
    #endDateParam;


    constructor(systemController) {
        this.#systemController = systemController;
    }


    init(container) {
        const scope = this;
        let activeNode = scope.#systemController.getActiveNode();


        scope.#contentModelService = new IeecloudContentService(import.meta.env.APP_SERVER_URL, import.meta.env.APP_SERVER_ROOT_URL);

        scope.#renderer = new IeecloudChartOneRenderer(activeNode);
        scope.#renderer.render(container);

        scope.#chartService = new IeecloudChartService();

        this.#service = new IeecloudChartOneService();

        let chartController = new IeecloudChartController([], scope.#systemController, scope.#chartService);
        const indicatorsElement = {code: 'a', name: 'Аналитика', title: '', zoomLimit: 0}
        chartController.init(indicatorsElement, scope.#renderer.oneContainer);
        scope.#chartControllers.push(chartController);

        const modalElement = document.getElementById('analyticChartModal');
        scope.#criteriaModal = new Modal(modalElement,  {backdrop : false});

        scope.#readCriteriaTableScheme();
        scope.#buildPointCriteriaTree();

        const analyticAddBtn = document.querySelector("#analyticAddBodyBtn");
        analyticAddBtn?.addEventListener('click', scope.#analyticAddClickListener);

        const analyticCleanBodyBtn = document.querySelector("#analyticCleanBodyBtn");
        analyticCleanBodyBtn?.addEventListener('click', scope.analyticCleanAll);

    }

    analyticCleanAll = (event) => {
        const scope = this;
        scope.#treeCriteriaSystemController.unsetActive();
        scope.#tableCriteriaRenderer.clearData();
        if (scope.#chartControllers && scope.#chartControllers.length > 0) {
            scope.#chartControllers.forEach(chartCtr => chartCtr.cleanChart());
        }
    }

    setDefaultDateRange(startDateParam, endDateParam) {
        this.#startDateParam = startDateParam;
        this.#endDateParam = endDateParam;
    }

    applyDateRange(startDateParam, endDateParam){
        const scope = this;
        const resultLinesData =  scope.#getAllChartDataFromCriteria();
        if (scope.#chartControllers && scope.#chartControllers.length > 0) {
            scope.#chartControllers.forEach(chartCtr => {
                chartCtr.cleanChart();
                resultLinesData.forEach(function (resultLineData) {
                    chartCtr.loadNewApiDataStore(resultLineData, startDateParam, endDateParam);
                })
            });
        }

        scope.#startDateParam = startDateParam;
        scope.#endDateParam = endDateParam;
    }
    buildCriteria() {
        const scope = this;
        scope.#criteriaModal.show();
        scope.#treeLightController.reInit();
    }

    #getAllChartDataFromCriteria() {
        const scope = this;

        let result = [];
        const rowNodes = scope.#tableCriteriaRenderer.getData();

        rowNodes.forEach(function (rowNode) {
            const rowNodeData = rowNode.data;
            const rowId = rowNode.id;
            let resultObj = {};
            for (let key in rowNodeData) {
                resultObj[key] = rowNodeData[key];
            }
            resultObj.id = rowId;
            result.push(resultObj);
        });
        return result;
    }

    #analyticAddClickListener = (event) => {
        const scope = this;

        const resultLinesData =  scope.#getAllChartDataFromCriteria();

        if (scope.#chartControllers && scope.#chartControllers.length > 0) {
            scope.#chartControllers.forEach(chartCtr => {
                resultLinesData.forEach(function (resultLineData) {
                    chartCtr.loadNewApiDataStore(resultLineData, scope.#startDateParam, scope.#endDateParam);
                })

            });
        }
        scope.#criteriaModal?.hide();
    }

    clearChartLine(id) {
        const scope = this;
        if (scope.#chartControllers && scope.#chartControllers.length > 0) {
            scope.#chartControllers.forEach(chartCtr => {
                chartCtr.clearDataStore(id);
            });
        }
    }

    hideShowChartLine(resultLineData, value) {
        const scope = this;
        if (scope.#chartControllers && scope.#chartControllers.length > 0) {
            scope.#chartControllers.forEach(chartCtr => {
                chartCtr.hideShowChartLine(resultLineData, value);
            });
        }
    }

    removeCriteria(node){
        const scope = this;
        scope.#tableCriteriaRenderer.removeCriteria(node);
        scope.clearChartLine(node.id);
    }

    #buildPointCriteriaTree() {
        const scope = this;
        let viewContentModelNode = scope.#systemController.viewContentModelNode;

        const activeModuleCode = viewContentModelNode.properties.code;
        const repoId = viewContentModelNode.properties.repoId;
        const formatData = viewContentModelNode.properties.formatData;

        let contentMetaData = {};
        contentMetaData.contentModelFileName = activeModuleCode + "/" + import.meta.env.VITE_APP_MODULE_CONTENT_MODEL;
        contentMetaData.useApi = false;
        if (repoId && repoId.trim().length !== 0) {
            contentMetaData.useApi = true;
            contentMetaData.repoId = repoId;
            contentMetaData.formatData = formatData;
        }
        scope.#contentModelService.getContentLayout(activeModuleCode + "/" + import.meta.env.VITE_APP_MODULE_TREE_SETTINGS, function (treeSettings) {
            scope.#contentModelService.getContentScheme(activeModuleCode + "/" + import.meta.env.VITE_APP_MODULE_CONTENT_SCHEMA, function (schemeModel) {

                scope.#contentModelService.getContentData(contentMetaData, schemeModel, function (treeData) {

                    scope.#treeCriteriaSystemController = new IeecloudTreeInspireImpl();
                    scope.#treeCriteriaSystemController.createTree(treeData);


                    const contentOptionsController = new IeecloudOptionsController(treeSettings, null, null, schemeModel, scope.#treeCriteriaSystemController);

                    scope.#treeLightController = new IeecloudTreeLightController(scope.#treeCriteriaSystemController, schemeModel, contentOptionsController.treeSettings);
                    scope.#treeLightController.init("Точка Измерения", "points-tree");

                    scope.#treeCriteriaSystemController.on('tree.activeNodeSet', function (node) {
                        //mean sensor select
                        if (node.properties.hasOwnProperty("type") && node.properties.type.trim().length !== 0) {
                            scope.#tableCriteriaRenderer.setCellValue("pointId", {
                                key: node.properties.code,
                                name: node.properties.code
                            });
                        }
                    });
                });
            });
        });
    }

    #readCriteriaTableScheme() {
        const scope = this;
        const containerTable = document.getElementById('analytic-criteria-table');
        this.#tableCriteriaRenderer = new IeecloudTableEditRenderer();

        scope.#tableCriteriaRenderer.addEventListener('IeecloudTableEditRenderer.hideCriteria', function (event) {
            const rowNode = event.value
            const rowNodeData = rowNode.data;
            const rowId = rowNode.id;
            let resultObj = {};
            for (let key in rowNodeData){
                // TODO: remove hardcode
                if (key === 'colorChart') {
                    continue;
                }
                resultObj[key] = rowNodeData[key].key;
            }
            resultObj.id = rowId;

            scope.hideShowChartLine(resultObj, true);
        });

        scope.#tableCriteriaRenderer.addEventListener('IeecloudTableEditRenderer.showCriteria', function (event) {
            const rowNode = event.value
            const rowNodeData = rowNode.data;
            const rowId = rowNode.id;
            let resultObj = {};
            for (let key in rowNodeData){
                // TODO: remove hardcode
                if (key === 'colorChart') {
                    continue;
                }
                resultObj[key] = rowNodeData[key].key;
            }
            resultObj.id = rowId;
            scope.hideShowChartLine(resultObj, false);
        });

        scope.#tableCriteriaRenderer.addEventListener('IeecloudTableEditRenderer.deleteCriteria', function (event) {
            scope.removeCriteria(event.value);
        });


        scope.#service.readCriteriaTableScheme(function (result) {
            scope.#tableCriteriaRenderer.render(containerTable, result.columnDefs, [
                {field: "colorChart", value: IeecloudAppUtils.randomColor, caller: IeecloudAppUtils}
            ]);
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
}