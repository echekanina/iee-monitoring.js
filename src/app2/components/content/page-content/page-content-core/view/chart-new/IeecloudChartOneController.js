import IeecloudChartService from "../chart/IeecloudChartService.js";
import IeecloudChartController from "../chart/IeecloudChartController.js";
import IeecloudChartOneService from "./IeecloudChartOneService.js";
import {IeecloudChartOneRenderer} from "../../../page-content-renderer/view/chart-new/IeecloudChartOneRenderer.js";
import {Modal} from "bootstrap";
import {values} from "lodash-es";
import IeecloudContentService from "../../../../content-core/IeecloudContentService.js";
import {IeecloudTreeInspireImpl} from "ieecloud-tree";
import IeecloudTreeLightController from "../../../../../tree/tree-core/IeecloudTreeLightController.js";
import {IeecloudAutoCompleteRenderer} from "../../../../../../main/common/autocomplete/IeecloudAutoCompleteRenderer.js";
// import IeecloudTableEditRenderer from "../../../page-content-renderer/view/table-edit/IeecloudTableEditRenderer.js";
import IeecloudOptionsController from "../../../../../options/options-core/IeecloudOptionsController.js";

export default class IeecloudChartOneController {
    #systemController;
    #renderer;
    #service;

    #chartControllers = [];
    #criteriaModal;

    #criteriaResultObject = {};
    #contentModelService;
    #treeCriteriaSystemController;
    #listCriteriaGroup;
    #chartService;
    #indicators = [];
    // #tableCriteriaRenderer;


    constructor(systemController) {
        this.#systemController = systemController;
    }


    init(container) {
        const scope = this;
        let activeNode = scope.#systemController.getActiveNode();
        this.#service = new IeecloudChartOneService();

        scope.#contentModelService = new IeecloudContentService(import.meta.env.APP_SERVER_URL, import.meta.env.APP_SERVER_ROOT_URL);

        scope.#renderer = new IeecloudChartOneRenderer(activeNode);
        scope.#renderer.render(container);

        scope.#chartService = new IeecloudChartService();
        let chartController = new IeecloudChartController([], scope.#systemController, scope.#chartService);
        const indicatorsElement = {code: 'a', name: 'Аналитика', title: 'Перемещение (м)', zoomLimit: 2592000000}
        chartController.init(indicatorsElement, scope.#renderer.oneContainer);
        scope.#chartControllers.push(chartController);

        const modalElement = document.getElementById('analyticChartModal');
        scope.#criteriaModal = new Modal(modalElement);


        scope.#buildListCriteriaGroup();
        // scope.#readCriteriaTableScheme();
        scope.#buildPointCriteriaTree();

        const analyticAddBtn = document.querySelector("#analyticAddBodyBtn");
        analyticAddBtn?.addEventListener('click', scope.#analyticAddClickListener);

        const analyticCleanBodyBtn = document.querySelector("#analyticCleanBodyBtn");
        analyticCleanBodyBtn?.addEventListener('click', scope.#analyticCleanClickListener);

        modalElement?.addEventListener('hidden.bs.modal', function (event) {
            scope.#analyticCleanClickListener();
        });

    }

    analyticCleanAll() {
        const scope = this;
        if (scope.#chartControllers && scope.#chartControllers.length > 0) {
            scope.#chartControllers.forEach(chartCtr => chartCtr.cleanChart());
        }
    }


    buildCriteria() {
        const scope = this;
        scope.#criteriaModal.show();
    }

    #analyticAddClickListener = (event) => {
        const scope = this;
        if (scope.#chartControllers && scope.#chartControllers.length > 0) {
            scope.#chartControllers.forEach(chartCtr => chartCtr.loadNewApiDataStore(scope.#criteriaResultObject));
        }

        scope.#criteriaModal?.hide();

    }

    #clearSelectCriteriaGroup() {
        const scope = this;

        scope.#listCriteriaGroup.forEach(function (listGroupItem) {
            if (listGroupItem.searchGroup) {
                listGroupItem.searchGroup.renderer.clearValue();
            }
        });
    }

    #analyticCleanClickListener = (event) => {
        const scope = this;

        scope.#clearSelectCriteriaGroup();
        scope.#treeCriteriaSystemController.unsetActive();
        scope.#criteriaResultObject = {};
        scope.#indicators = [];
    }

    #addDomListeners(listGroup) {
        listGroup.forEach(function (listGroupItem) {
            if (listGroupItem.selectGroup) {
                listGroupItem.selectGroup.renderer.addDomListeners();
            } else if (listGroupItem.searchGroup) {
                listGroupItem.searchGroup.renderer.addDomListeners();
            }
        });
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

                    const treeController = new IeecloudTreeLightController(scope.#treeCriteriaSystemController, schemeModel, contentOptionsController.treeSettings);
                    treeController.init("Точка Измерения", "points-tree");

                    scope.#treeCriteriaSystemController.on('tree.activeNodeSet', function (node) {
                        scope.#indicators = [];
                        scope.#criteriaResultObject = {};
                        scope.#clearSelectCriteriaGroup();
                        //mean sensor select
                        if (node.properties.hasOwnProperty("type") && node.properties.type.trim().length !== 0) {
                            scope.#criteriaResultObject["pointId"] = node.properties.code;

                            scope.#chartService.readScheme(node.properties, function (result) {
                                result.schema.properties.forEach(function (property) {
                                    if (!property.code.includes('_')) {

                                        if (property.type === 'real') {
                                            scope.#indicators.push(property.name);
                                        }
                                    }
                                });
                            })
                        }
                    });
                });
            });
        });
    }

    // #readCriteriaTableScheme() {
    //     const scope = this;
    //     const containerTable = document.getElementById('analytic-criteria-table');
    //     this.#tableCriteriaRenderer = new IeecloudTableEditRenderer();
    //     this.#tableCriteriaRenderer.render(containerTable);
    //
    //
    //     scope.#service.readCriteriaTableScheme(function (result) {
    //         scope.#tableCriteriaRenderer.render(containerTable, result.columnDefs);
    //     });
    // }

    #buildListCriteriaGroup() {
        const scope = this;
        scope.#listCriteriaGroup = [];
        scope.#service.readCriteriaScheme(function (result) {

            result.forEach(function (item) {

                let itemListGroup = {
                    label: item.name,
                    id: item.code,
                    repoCode: item.repo_code,
                    itemsListFromBA: []
                }


                itemListGroup.searchGroup = {
                    renderer: new IeecloudAutoCompleteRenderer(null, {
                        updateInputAfterSelectItem: true,
                        inputValue: '',
                        model: itemListGroup.id,
                        repoCode: item.repo_code,
                        selectGroupData: 'auto' + '-' + itemListGroup.id
                    })
                }
                itemListGroup.searchGroup.renderer.addEventListener('IeecloudAutoCompleteRenderer.autoComplete', function (event) {
                    const searchText = event.value;
                    const nodes = itemListGroup.itemsListFromBA;
                    let filterSearch = nodes.filter(a => {
                        if (a.name.toLowerCase().includes(searchText.toLowerCase())) {
                            return true;
                        }
                    });

                    itemListGroup.searchGroup.renderer.drawAutoComplete(filterSearch);

                });
                itemListGroup.searchGroup.renderer.addEventListener('IeecloudAutoCompleteRenderer.fullList', function (event) {

                    const searchModel = event.target.searchModel;

                    const searchParam = {
                        repoCode: searchModel.repoCode
                    }

                    scope.#service.readCriteriaItemScheme(searchParam, function (scheme) {
                        scope.#service.searchCriteria(searchParam, scheme, function (data) {
                            let resultSearch = data;
                            let pointNode = scope.#treeCriteriaSystemController.getActiveNode();
                            if (pointNode && scope.#criteriaResultObject["pointId"]) {
                                if (searchModel.model === "mom_type") {
                                    resultSearch = resultSearch.filter(a => values(a).some(b => b.includes(pointNode.properties.type)))
                                } else if (searchModel.model === "indicator_code") {
                                    resultSearch = resultSearch.filter(a => {
                                        if (scope.#indicators.includes(a.name)) {
                                            return true;
                                        }
                                    });
                                }
                            }
                            itemListGroup.itemsListFromBA = resultSearch;
                            itemListGroup.searchGroup.renderer.drawAutoComplete(resultSearch);
                        });
                    })
                });

                itemListGroup.searchGroup.renderer.addEventListener('IeecloudAutoCompleteRenderer.setActiveNode', function (event) {
                    const data = event.value;
                    scope.#criteriaResultObject[data.model] = data.value;
                });

                scope.#listCriteriaGroup.push(itemListGroup)

            })

        });

        let listGroupTemplate = scope.#renderer.buildListGroup(scope.#listCriteriaGroup);
        const containerList = document.getElementById('analytic-criteria');
        containerList?.insertAdjacentHTML('afterbegin', listGroupTemplate);
        this.#addDomListeners(scope.#listCriteriaGroup);
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