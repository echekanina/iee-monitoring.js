import 'ag-grid-community/styles/ag-grid.css';
import './styles/ag-theme-ieemonitoring.scss';
import {Grid} from "ag-grid-community";
import IeecloudTableService from "./IeecloudTableService.js";
import {eventBus} from "../../../../../main/index.js";


export default class IeecloudTableRenderer {
    #node;
    #layoutModel;
    #gridOptions;
    #LIMIT_PAGE_SIZE = 30;

    constructor(layoutModel, node) {
        this.#node = node;
        this.#layoutModel = layoutModel;
    }

    generateTemplate() {
        return `<div id="myGrid-` + this.#layoutModel.id + `" style="height: 100%;width:100%;" class="ag-theme-custom"></div>`;
    }

    destroy() {
        if (this.#gridOptions) {
            this.#gridOptions.api?.destroy();
        }
    }

    render(container) {
        const scope = this;
        container.innerHTML = '';
        container.insertAdjacentHTML('beforeend', this.generateTemplate());


        this.#gridOptions = {
            defaultColDef: {
                sortable: true,
                flex: 1,
                minWidth: 100,
            },
            pagination: true,
            enableBrowserTooltips: true,
            cacheBlockSize: scope.#LIMIT_PAGE_SIZE,
            animateRows: true,
            paginationPageSize: scope.#LIMIT_PAGE_SIZE,
            onRowClicked: (event) => scope.#onRowClick(event.data.id),
            onGridSizeChanged: function (params) {

                setTimeout(function () {
                    params.api.sizeColumnsToFit();
                });
            },
            onGridReady: function (params) {
                params.api.sizeColumnsToFit();
            }
        }
        const nodeProps = this.#node.properties;
        const tableService = new IeecloudTableService(nodeProps.dataService, scope.#layoutModel.dataType, nodeProps);
        tableService.buildColumnDefinitionsAndFilter(nodeProps, function (result) {
            scope.#gridOptions.columnDefs = result.columnDefs;
            tableService.getDataTable(nodeProps, scope.#gridOptions.columnDefs, function (data) {
                scope.#gridOptions.rowData = data;
                const eGridDiv = document.querySelector('#myGrid-' + scope.#layoutModel.id);
                new Grid(eGridDiv, scope.#gridOptions);
            });
        });


    }


    #onRowClick(objId) {
        const data = {objId: objId, activeNode: this.#node}
        eventBus.emit('IeecloudTableRenderer.rowClick', data, false);
    }

}