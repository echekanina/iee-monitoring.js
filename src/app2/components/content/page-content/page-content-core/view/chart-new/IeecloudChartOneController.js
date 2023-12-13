import IeecloudChartService from "../chart/IeecloudChartService.js";
import IeecloudChartController from "../chart/IeecloudChartController.js";
import IeecloudChartOneService from "./IeecloudChartOneService.js";
import {IeecloudChartOneRenderer} from "../../../page-content-renderer/view/chart-new/IeecloudChartOneRenderer.js";
import {Modal} from "bootstrap";
import {IeecloudSearchBlockRenderer} from "../../../../../topbar/search-block/IeecloudSearchBlockRenderer.js";
import {values} from "lodash-es";

export default class IeecloudChartOneController {
    #systemController;
    #renderer;
    #service;

    #chartControllers = [];
    #criteriaModal;

    #criteriaResultObject = {};


    constructor(systemController) {
        this.#systemController = systemController;
    }


    init(container) {
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        this.#service = new IeecloudChartOneService();

        scope.#renderer = new IeecloudChartOneRenderer(activeNode);
        scope.#renderer.render(container);

        const chartService = new IeecloudChartService();
        let chartController = new IeecloudChartController([], scope.#systemController, chartService);
        const indicatorsElement = {code: 'a', name: 'Аналитика', title: 'Перемещение (м)', zoomLimit: 2592000000}
        chartController.init(indicatorsElement, scope.#renderer.oneContainer);
        scope.#chartControllers.push(chartController);
    }

    buildCriteria(){
        const scope = this;
        const modalElement = document.getElementById('analyticChartModal');

        let  listGroup = [];

        this.#service.readCriteriaScheme(function(result){

            result.forEach(function(item){

                let itemListGroup = {
                    label: item.name,
                    id: item.code,
                    repoCode: item.repo_code
                }


                itemListGroup.searchGroup = {
                    renderer: new IeecloudSearchBlockRenderer(null, {
                        updateInputAfterSelectItem: true,
                        inputValue: '',
                        model: itemListGroup.id,
                        repoCode: item.repo_code,
                        selectGroupData: 'auto' + '-' + itemListGroup.id
                    })
                }
                itemListGroup.searchGroup.renderer.addEventListener('IeecloudSearchBlockRenderer.searchNode', function (event) {
                    const searchText = event.value;

                    const searchModel = event.target.searchModel;

                    const searchParam = {
                        repoCode: searchModel.repoCode,
                        searchText : searchText
                    }

                    scope.#service.readCriteriaItemScheme(searchParam, function(scheme){
                        scope.#service.searchCriteria(searchParam, scheme, function(data){

                            // console.log(data.filter(a=> values(a).some(b => b.includes(searchText))));

                            const resultSearch  = data.filter(a=> values(a).some(b => b.includes(searchText)))

                            itemListGroup.searchGroup.renderer.drawAutoComplete(resultSearch);
                        });
                    })
                });

                itemListGroup.searchGroup.renderer.addEventListener('IeecloudSearchBlockRenderer.setActiveNode', function (event) {
                    const data = event.value;
                    scope.#criteriaResultObject[data.model] = data.value;
                });

                listGroup.push(itemListGroup)

            })

        });
        scope.#criteriaModal = new Modal(modalElement);
        let listGroupTemplate = this.#buildListGroup(listGroup);
        const container = document.getElementById('analytic-criteria-container');
        container?.insertAdjacentHTML('afterbegin', listGroupTemplate);
        this.#addDomListeners(listGroup);
        scope.#criteriaModal.show();

        const analyticAddBtn = document.querySelector("#analyticAddBodyBtn");
        analyticAddBtn?.addEventListener('click', scope.#analyticAddClickListener);

        modalElement?.addEventListener('hidden.bs.modal', function (event) {
            container.innerHTML =''
        });
    }

    #analyticAddClickListener = (event) => {
        const scope = this;
        if (scope.#chartControllers && scope.#chartControllers.length > 0) {
            scope.#chartControllers.forEach(chartCtr => chartCtr.loadNewApiDataStore(scope.#criteriaResultObject));
        }

        scope.#criteriaModal?.hide();

    }

    #addDomListeners(listGroup) {
        listGroup.forEach(function(listGroupItem){
            if (listGroupItem.selectGroup) {
                listGroupItem.selectGroup.renderer.addDomListeners();
            } else if (listGroupItem.searchGroup) {
                listGroupItem.searchGroup.renderer.addDomListeners();
            }
        });
    }

    #buildListGroup(listGroup) {
        let template = ``
        if (listGroup) {
            template = template + `<div class="list-group">`
            listGroup.forEach(function (listGroupItem) {

                if (listGroupItem.selectGroup) {
                    template = template + `  <div href="#" class="list-group-item d-flex  align-items-center">
                     <span style="width:20%">${listGroupItem.label}</span>` + listGroupItem.selectGroup.renderer.generateTemplate() + `</div>`;

                } else if (listGroupItem.searchGroup) {
                    template = template + `  <div href="#" class="list-group-item d-flex align-items-center">
                     <span style="width:20%">${listGroupItem.label}</span>` + listGroupItem.searchGroup.renderer.generateTemplate() + `</div>`;
                }

            });
            template = template + `</div>`;
        }
        return template;
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