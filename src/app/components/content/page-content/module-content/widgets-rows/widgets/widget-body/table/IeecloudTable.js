import 'ag-grid-community/styles/ag-grid.css';
import './styles/ag-theme-ieemonitoring.scss';
import {Grid} from "ag-grid-community";
import IeecloudTableService from "./IeecloudTableService.js";
import EventEmitter2 from "eventemitter2";

export default class IeecloudTable extends EventEmitter2 {
    layoutModel;
    observableObject;
    #template
    #LIMIT_PAGE_SIZE = 10;

    constructor(layoutModel, observableObject) {
        super();
        this.layoutModel = layoutModel;
        this.observableObject = observableObject;
    }

    generateTemplate() {
        this.#template = `<div id="myGrid-` + this.layoutModel.id + `" style="height: 100%;width:100%;" class="ag-theme-custom"></div>`;
        return this.#template;
    }


    #onRowClick(groupId) {
        this.observableObject.emit('IeecloudTableRenderer.rowClick', groupId, false);
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
            cacheBlockSize: scope.#LIMIT_PAGE_SIZE,
            animateRows: true,
            paginationPageSize: scope.#LIMIT_PAGE_SIZE,
            onRowClicked: (event) => scope.#onRowClick(event.data.id),
            onGridReady: function (params) {
                params.api.sizeColumnsToFit();
            }
        }

        const tableService = new IeecloudTableService(scope.observableObject.moduleItemModel.data.dataService);
        tableService.buildColumnDefinitions(`?action=schema&repoId=` + scope.observableObject.moduleItemModel.data.repoId + `&groupId=` + scope.observableObject.moduleItemModel.data.groupId, function (result) {
            gridOptions.columnDefs = result;
            tableService.getDataTable(`?action=data&repoId=` + scope.observableObject.moduleItemModel.data.repoId + `&groupId=` + scope.observableObject.moduleItemModel.data.groupId + `&limit=100`, gridOptions.columnDefs, function (data) {
                gridOptions.rowData = data;
                const eGridDiv = document.querySelector('#myGrid-' + scope.layoutModel.id);
                new Grid(eGridDiv, gridOptions);
            });
        });
    }
}