import {Grid} from "ag-grid-community";
import IeecloudTableService from "./IeecloudTableService.js";

export default class IeecloudTable {
    model;
    #template
    constructor(model) {
        this.model = model;
    }

    generateTemplate(){
        this.#template = `<div id="myGrid-` + this.model.id + `" style="height: 100%;width:100%;" class="ag-theme-alpine"></div>`;
        return this.#template;
    }

    insertTemplates() {
        const scope = this;
        const gridOptions = {
            onGridReady: function(params) {
                params.api.sizeColumnsToFit();
            }
        }

        const tableService = new IeecloudTableService(scope.model.dataSource);
        tableService.buildColumnDefinitions(scope.model.scheme, function(result){
            console.log(result);
            gridOptions.columnDefs = result;
            tableService.getDataTable(scope.model.data, gridOptions.columnDefs,  function(data){
                gridOptions.rowData = data;
                const eGridDiv = document.querySelector('#myGrid-'+ scope.model.id);
                new Grid(eGridDiv, gridOptions);
            });
        });
    }
}