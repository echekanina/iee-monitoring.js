import IeecloudChartService from "../chart/IeecloudChartService.js";
import IeecloudChartController from "../chart/IeecloudChartController.js";
import IeecloudChartOneService from "./IeecloudChartOneService.js";
import {IeecloudChartOneRenderer} from "../../../page-content-renderer/view/chart-new/IeecloudChartOneRenderer.js";
import {Modal} from "bootstrap";
import IeecloudContentService from "../../../../content-core/IeecloudContentService.js";
import {IeecloudFormBuilder, IeecloudTreeInspireImpl} from "ieecloud-tree";
import IeecloudTreeLightController from "../../../../../tree/tree-core/IeecloudTreeLightController.js";
import IeecloudOptionsController from "../../../../../options/options-core/IeecloudOptionsController.js";
import IeecloudTableEditRenderer from "../../../page-content-renderer/view/table-edit/IeecloudTableEditRenderer.js";
import IeecloudAppUtils from "../../../../../../main/utils/IeecloudAppUtils.js";
import {cloneDeep, isUndefined, remove} from "lodash-es";

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
    #nodesMap;
    #formBuilderInstance;
    #createNodeModal;
    #containerCreateNodeForm;
    #createNodeBtn;
    #defaultStoreTypes;


    constructor(defaultStoreTypes, systemController) {
        this.#systemController = systemController;
        this.#defaultStoreTypes = defaultStoreTypes;
        this.#nodesMap =  this.#systemController.treeNodesSchemeMap; // TODO: see TODO in IeecloudSideBarController

    }


    init(container) {
        const scope = this;
        let activeNode = scope.#systemController.getActiveNode();

        scope.#contentModelService = new IeecloudContentService(import.meta.env.APP_SERVER_URL, import.meta.env.APP_SERVER_ROOT_URL);

        scope.#renderer = new IeecloudChartOneRenderer(activeNode);
        scope.#renderer.render(container);

        scope.#service  = new IeecloudChartOneService();
        scope.#chartService = new IeecloudChartService();
        let chartController = new IeecloudChartController(scope.#defaultStoreTypes, scope.#systemController, scope.#chartService, false, scope.#service);
        const indicatorsElement = {code: 'a', name: activeNode.properties.name, title: '', zoomLimit: 0}
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


        this.#formBuilderInstance = new IeecloudFormBuilder({asDialog: false, submitBtn : false});


        const modalElementCreate = document.getElementById("createAnalyticsNodesModal-" + activeNode.id);
        if (modalElementCreate) {
            scope.#createNodeModal = new Modal(modalElementCreate, {backdrop: false});

            modalElementCreate?.addEventListener('hidden.bs.modal', function (event) {
                scope.#formBuilderInstance.onCancelForm();
            });

            scope.#containerCreateNodeForm = "FormAnalytic-" + activeNode.id;
            scope.#createNodeBtn = "newAnalysisCreateBtn-" + activeNode.id;

            scope.#formBuilderInstance.on('formBuilder.cancelFrom', function () {
                scope.#hideNewAnalysisModal();
            });

            const analysisNewAddBtn = document.querySelector("#" + scope.#createNodeBtn);
            analysisNewAddBtn?.addEventListener('click', scope.#analysisNewAddClickListener);
        }
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

    screenshot(){
       const scope = this;
        if (scope.#chartControllers && scope.#chartControllers.length > 0) {
            scope.#chartControllers.forEach(chartCtr => {
                chartCtr.screenshot();
            });
        }
    }

    applyDateRange(startDateParam, endDateParam){
        const scope = this;
        const resultLinesData =  scope.#getAllChartDataFromCriteria();
        if (scope.#chartControllers && scope.#chartControllers.length > 0) {

            scope.#chartControllers.forEach(chartCtr => {
                chartCtr.abortRequestIfPending();
            });

            scope.#chartControllers.forEach(chartCtr => {
                chartCtr.rebuildAbortController();
            });

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
        scope.#criteriaModal?.show();
        scope.#treeLightController?.reInit();
    }

    addNewAnalysis() {
        const scope = this;

        let activeNode = scope.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;



        const nodeScheme = scope.#nodesMap[nodeProps.schemeNodeId];

        let formProperties = nodeScheme.properties.filter(item => {
            if (!item.system) {
                return true;
            }
        });

        scope.#formBuilderInstance.create(scope.#containerCreateNodeForm, formProperties, scope.#containerCreateNodeForm);

        scope.#createNodeModal?.show();


        scope.#formBuilderInstance.on('formBuilder.submitValues', function (properties) {

            properties.id = undefined;

            const newNodeProperties = Object.assign(cloneDeep(nodeProps), properties);

            const newNode = scope.#systemController.createNode(newNodeProperties, nodeScheme, activeNode.parent);
            scope.#hideNewAnalysisModal();

            scope.#systemController.setActiveNode(newNode.id);

        });
    }

    #analysisNewAddClickListener = (event) => {
        const scope = this;
        scope.#formBuilderInstance.submitForm(scope.#containerCreateNodeForm);
    }

    #hideNewAnalysisModal() {
        this.#createNodeModal?.hide();
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

    #getCriteriaRowsAndAddToChart(){
        const scope = this;
        const resultLinesData =  scope.#getAllChartDataFromCriteria();

        if (scope.#chartControllers && scope.#chartControllers.length > 0) {
            scope.#chartControllers.forEach(chartCtr => {
                resultLinesData.forEach(function (resultLineData) {
                    chartCtr.loadNewApiDataStore(resultLineData, scope.#startDateParam, scope.#endDateParam);
                })
            });
        }
    }

    #analyticAddClickListener = (event) => {
        const scope = this;
        scope.#getCriteriaRowsAndAddToChart();
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

        scope.#renderer.showSpinner();

        scope.#contentModelService.getContentLayout(activeModuleCode + "/" + import.meta.env.VITE_APP_MODULE_TREE_SETTINGS, function (treeSettings) {
            scope.#contentModelService.getContentScheme(activeModuleCode + "/" + import.meta.env.VITE_APP_MODULE_CONTENT_SCHEMA, function (schemeModel) {

                scope.#contentModelService.getContentData(contentMetaData, schemeModel, function (treeData) {

                    scope.#treeCriteriaSystemController = new IeecloudTreeInspireImpl();
                    scope.#treeCriteriaSystemController.createTree(treeData);


                    const contentOptionsController = new IeecloudOptionsController(treeSettings, null, null, schemeModel, scope.#treeCriteriaSystemController);

                    scope.#treeLightController = new IeecloudTreeLightController(scope.#treeCriteriaSystemController, schemeModel, contentOptionsController.treeSettings);
                    scope.#treeLightController.init("Точка Измерения",  scope.#renderer.treeContainerId);

                    scope.#renderer.removeSpinner();

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

        const activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;

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
            if (!isUndefined(nodeProps.id)) { // means node is not draft
                scope.#loadExistingAnalysisByNode(result.columnDefs);
            }

        });
    }

    #loadExistingAnalysisByNode(criteriaTableSchemeColumns){
        const scope = this;
        let activeNode = scope.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;
        scope.#service.readScheme(nodeProps, criteriaTableSchemeColumns, function (result) {
            scope.#service.getAnalysisData(nodeProps, result, function (data) {
                scope.#tableCriteriaRenderer.addRows(data);
                scope.#getCriteriaRowsAndAddToChart();
            });
        });
    }

    destroy() {
        const scope = this;
        scope.#treeLightController?.destroy();
        scope.#tableCriteriaRenderer?.destroy();
        scope.#renderer?.destroy();

        if (scope.#chartControllers && scope.#chartControllers.length > 0) {
            scope.#chartControllers.forEach(chartCtr => chartCtr.destroy())
        }
        scope.#chartControllers = [];
    }

    loadStore(itemStore) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        const nodeProps = activeNode.properties;

        scope.#defaultStoreTypes.push(itemStore);

        if (itemStore.store.includes("journal.events")) {
            scope.#service.readStoreScheme(nodeProps, itemStore.store, function (result) {
                scope.#service.readStoreData(nodeProps, result.schema, itemStore.store, function (data) {
                    if (scope.#chartControllers && scope.#chartControllers.length > 0) {
                        scope.#chartControllers.forEach(chartCtr => {
                            chartCtr.updateDefaultStoreTypes(scope.#defaultStoreTypes);
                            chartCtr.loadEventStore(itemStore, data);
                        })
                    }
                }, itemStore.filter, itemStore.filterValues === "${node_code}" ? activeNode.properties.code : "");
            });
        }
    }


    clearStore(itemStore) {
        const scope = this;
        remove(scope.#defaultStoreTypes, item => item.id === itemStore.id);

        if (itemStore.store.includes("journal.events")) {
            if (scope.#chartControllers && scope.#chartControllers.length > 0) {
                scope.#chartControllers.forEach(chartCtr => {
                    chartCtr.updateDefaultStoreTypes(scope.#defaultStoreTypes);
                    chartCtr.clearEventStore(itemStore.id)
                })
            }
        }

    }

    fullScreen() {
        if (this.#renderer.fullScreen) {
            this.#renderer.fullScreen();
        }
    }

    get defaultStoreTypes() {
        return this.#defaultStoreTypes;

    }
}