import IeecloudTableRenderer from "../../../page-content-renderer/view/table/IeecloudTableRenderer.js";
import IeecloudTableService from "./IeecloudTableService.js";
import {Grid} from "ag-grid-community";

export default class IeecloudTableController {
    #widgetContentModel;
    #systemController;
    #renderer;
    constructor(widgetContentModel, systemController) {
        this.#widgetContentModel = widgetContentModel;
        this.#systemController = systemController;
    }

    init(container){
        const scope = this;
        let activeNode = this.#systemController.getActiveNode();
        this.#renderer = new IeecloudTableRenderer(scope.#widgetContentModel, activeNode);
        this.#renderer.render(container);

        const nodeProps = activeNode.properties;
        const tableService = new IeecloudTableService(nodeProps.dataService, scope.#widgetContentModel.dataType, nodeProps);
        tableService.buildColumnDefinitionsAndFilter(nodeProps, function (result) {
            // scope.#gridOptions.columnDefs = result.columnDefs;
            tableService.getDataTable(nodeProps, result.columnDefs, function (data) {
                // container.innerHTML = '';
                // container.insertAdjacentHTML('beforeend', scope.generateTemplate());
                // scope.#gridOptions.rowData = data;
                // const eGridDiv = document.querySelector('#myGrid-' + scope.#layoutModel.id);
                // if (eGridDiv) {
                //     new Grid(eGridDiv, scope.#gridOptions);
                // }

                scope.#renderer.renderTable(result.columnDefs, data, container);
            });
        });
    }

    destroy(){
        this.#renderer.destroy();
    }

    fullScreen(){
        if(this.#renderer.fullScreen){
            this.#renderer.fullScreen();
        }
    }


}