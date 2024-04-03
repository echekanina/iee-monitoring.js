import 'ag-grid-community/styles/ag-grid.css';
import './styles/ag-theme-ieemonitoring.scss';
import {eventBus} from "../../../../../../main/index.js";
import * as agGrid from "ag-grid-community";
import EventDispatcher from "../../../../../../main/events/EventDispatcher.js";
import IeecloudLoadingCellRenderer from "./IeecloudLoadingCellRenderer.js";


export default class IeecloudTableRenderer extends EventDispatcher {
    #node;
    #layoutModel;
    #gridOptions;
    #LIMIT_PAGE_SIZE = 10;
    #gridApi;

    constructor(layoutModel, node) {
        super();
        this.#node = node;
        this.#layoutModel = layoutModel;
    }

    generateTemplate() {
        return `<div id="myGrid-` + this.#layoutModel.id + `" style="height: 100%;width:100%;" class="ag-theme-custom"></div>`;
    }

    destroy() {
        if (this.#gridApi) {
            this.#gridApi.destroy();
        }
    }

    render(container) {
        const scope = this;

        this.#gridOptions = {
            autoSizeStrategy: {
                type: 'fitCellContents'
            },
            paginationPageSizeSelector : false,
            defaultColDef: {
                // width:20,
                // sortable: true,
                // flex: 1,
                minWidth: 20,
                cellRenderer : IeecloudLoadingCellRenderer,
                cellRendererParams: {
                    loadingMessage: "Загрузка...",
                }
            },
            pagination: true,
            enableBrowserTooltips: true,
            cacheBlockSize: scope.#LIMIT_PAGE_SIZE,
            animateRows: true,
            paginationPageSize: scope.#LIMIT_PAGE_SIZE,
            rowModelType: 'infinite',
            onRowClicked: (event) => scope.#onRowClick(event.data.id),
            onGridReady: function (params) {
                const dataSource = {
                    getRows: (params) => {
                        scope.dispatchEvent({type: 'IeecloudTableRenderer.getRows',
                            value: {params: params}
                        });
                    },
                };

                scope.#gridApi.setGridOption('datasource', dataSource);
            }
        }

        const spinner = `<div class="d-flex justify-content-center">
            <div class="spinner-border" style="width: 4rem; height: 4rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>`

        container.insertAdjacentHTML('beforeend', spinner);
    }

    renderPageData(params, data) {
        params.successCallback(data.rowData, data.totalRecords);
        this.#autoSizeAll(false);
    }

    renderTable(columnDefs, container) {
        const scope = this;
        container.innerHTML = '';
        container.insertAdjacentHTML('beforeend', scope.generateTemplate());
        scope.#gridOptions.columnDefs = columnDefs;
        const eGridDiv = document.querySelector('#myGrid-' + scope.#layoutModel.id);
        if (eGridDiv) {
           scope.#gridApi = agGrid.createGrid(eGridDiv, scope.#gridOptions);
        }
    }


    #onRowClick(objId) {
        const data = {objId: objId, activeNode: this.#node}
        eventBus.emit('IeecloudTableRenderer.rowClick', data, false);
    }

    #autoSizeAll(skipHeader) {
        const scope = this;
        const allColumnIds = [];
        scope.#gridApi.getColumns().forEach((column) => {
            allColumnIds.push(column.getId());
        });

        scope.#gridApi.autoSizeColumns(allColumnIds, skipHeader);
    }


    fullScreen(){
        const bodyContainerElement = document.getElementById("myGrid-" + this.#layoutModel.id);
        if (bodyContainerElement.requestFullscreen) {
            bodyContainerElement.requestFullscreen();
        } else if (bodyContainerElement.webkitRequestFullscreen) { /* Safari */
            bodyContainerElement.webkitRequestFullscreen();
        } else if (bodyContainerElement.msRequestFullscreen) { /* IE11 */
            bodyContainerElement.msRequestFullscreen();
        }
    }

}