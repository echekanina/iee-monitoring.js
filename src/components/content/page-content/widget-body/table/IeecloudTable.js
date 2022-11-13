import 'ag-grid-community/styles/ag-grid.css';
// import './styles/ag-theme-ieemonitoring.css';
import './styles/ag-theme-ieemonitoring.scss';
import {Grid} from "ag-grid-community";
import IeecloudTableService from "./IeecloudTableService.js";

export default class IeecloudTable {
    model;
    #template
    constructor(model) {
        this.model = model;
    }

    generateTemplate(){
        this.#template = `<div id="myGrid-` + this.model.id + `" style="height: 100%;width:100%;" class="ag-theme-custom"></div>`;
        return this.#template;
    }

    insertTemplates() {
        const scope = this;
        const gridOptions = {
            defaultColDef: {
                sortable: true,
                flex: 1,
                minWidth: 100,
            },
            pagination: true,
            paginationPageSize: 6,
            onGridReady: function(params) {
                params.api.sizeColumnsToFit();
            }
        }

        const tableService = new IeecloudTableService(scope.model.dataSource);
        tableService.buildColumnDefinitions(scope.model.scheme, function(result){
            gridOptions.columnDefs = result;
            tableService.getDataTable(scope.model.data, gridOptions.columnDefs,  function(data){
                gridOptions.rowData = data;
                const eGridDiv = document.querySelector('#myGrid-'+ scope.model.id);
                new Grid(eGridDiv, gridOptions);
            });
        });
    }
}