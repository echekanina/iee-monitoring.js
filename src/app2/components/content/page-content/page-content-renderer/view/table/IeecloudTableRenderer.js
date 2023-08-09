import 'ag-grid-community/styles/ag-grid.css';
import './styles/ag-theme-ieemonitoring.scss';
import {Grid} from "ag-grid-community";
import {eventBus} from "../../../../../../main/index.js";


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

        const spinner = `<div class="d-flex justify-content-center">
            <div class="spinner-border" style="width: 4rem; height: 4rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>`

        container.insertAdjacentHTML('beforeend', spinner);
    }

    renderTable(columnDefs, data, container) {
        const scope = this;
        container.innerHTML = '';
        container.insertAdjacentHTML('beforeend', scope.generateTemplate());
        scope.#gridOptions.columnDefs = columnDefs;
        scope.#gridOptions.rowData = data;
        const eGridDiv = document.querySelector('#myGrid-' + scope.#layoutModel.id);
        if (eGridDiv) {
            new Grid(eGridDiv, scope.#gridOptions);
        }
    }


    #onRowClick(objId) {
        const data = {objId: objId, activeNode: this.#node}
        eventBus.emit('IeecloudTableRenderer.rowClick', data, false);
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