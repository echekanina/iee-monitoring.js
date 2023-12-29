import 'ag-grid-community/styles/ag-grid.css';
import './styles/ag-theme-ieemonitoring.scss';
import {Grid} from "ag-grid-community";
import {v4 as uuidv4} from "uuid";
import EventDispatcher from "../../../../../../main/events/EventDispatcher.js";


export default class IeecloudTableEditRenderer extends EventDispatcher{
    #node;
    #layoutModel;
    #gridOptions;
    #LIMIT_PAGE_SIZE = 30;
    #uuid;
    #inputRow = {};
    #rowData;
    #activeMasterCellValue = {};

    constructor(node) {
        super();
        this.#node = node;
    }

    generateTemplate() {
        this.#uuid = uuidv4();
        return `<div id="myGrid-` + this.#uuid + `" style="height: 100%;width:100%;" class="ag-theme-custom"></div>`;
    }

    destroy() {
        if (this.#gridOptions) {
            this.#gridOptions.api?.destroy();
        }
    }

    #setRowData(newData) {
        this.#rowData = newData;
        this.#gridOptions.api.setRowData(this.#rowData);
    }

    #setInputRow(newData) {
        if (Object.keys(this.#activeMasterCellValue).length) {
            newData = {...newData, ...this.#activeMasterCellValue};
        }
        this.#inputRow = newData;
        this.#gridOptions.api.setPinnedTopRowData([this.#inputRow]);
    }

    setCellValue(colKey, value){
        const scope = this;
        const rowNode = this.#gridOptions.api.getPinnedTopRow(0);
        rowNode.setDataValue(colKey, value);
        scope.#activeMasterCellValue[colKey] = value;
        if (scope.#isPinnedRowDataCompleted(rowNode)) {
            // save data
            scope.#setRowData([...scope.#rowData, scope.#inputRow]);
            //reset pinned row
            scope.#setInputRow({});
        }
    }

    render(container, columnDefs) {
        const scope = this;


        // this.#gridOptions = {
        //     defaultColDef: {
        //         sortable: false,
        //         flex: 1,
        //         minWidth: 100,
        //     },
        //     pagination: false,
        //     enableBrowserTooltips: true,
        //     cacheBlockSize: scope.#LIMIT_PAGE_SIZE,
        //     animateRows: true,
        //     paginationPageSize: scope.#LIMIT_PAGE_SIZE,
        //     // onRowClicked: (event) => scope.#onRowClick(event.data.id),
        //     onGridSizeChanged: function (params) {
        //
        //         setTimeout(function () {
        //             params.api.sizeColumnsToFit();
        //         });
        //     },
        //     onGridReady: function (params) {
        //         params.api.sizeColumnsToFit();
        //     }
        // }

        // const columnDefs = [
        //     { field: 'athlete' },
        //     {
        //         field: 'sport',
        //         cellRenderer: SportRenderer,
        //         cellEditor: 'agRichSelectCellEditor',
        //         cellEditorParams: {
        //             values: ['Swimming', 'Gymnastics', 'Cycling', 'Ski Jumping'],
        //             cellRenderer: SportRenderer,
        //         },
        //     },
        //     { field: 'date', cellEditor: DatePicker },
        //     { field: 'age' },
        // ];


        scope.#gridOptions = {
            rowData: null,
            columnDefs: columnDefs,
            pinnedTopRowData: [scope.#inputRow],
            onRowClicked: (event) => scope.#onRowClick(event),
            defaultColDef: {
                flex: 1,
                editable: true
            },

            // getRowId: () => uuidv4(),

            getRowStyle: ({node}) =>
                node.rowPinned ? {'font-weight': 'bold', 'font-style': 'italic'} : 0,

            onCellEditingStopped: (params) => {
                if (scope.#isPinnedRowDataCompleted(params)) {
                    scope.#setRowData([...scope.#rowData, scope.#inputRow]);
                    scope.#setInputRow({});
                }
            },
        };


        container.innerHTML = '';
        container.insertAdjacentHTML('beforeend', scope.generateTemplate());

        const eGridDiv = document.querySelector('#myGrid-' + this.#uuid);
        if (eGridDiv) {
            new Grid(eGridDiv, scope.#gridOptions);
        }

        scope.#setRowData([]);
    }

    #onRowClick(e){

        const scope = this;

        if (e.event.target !== undefined) {
            let data = e.data;
            let actionType = e.event.target.getAttribute('data-action-type');
            switch (actionType) {
                case 'hide':
                    e.event.target.textContent = "Показать";
                    e.event.target.setAttribute('data-action-type', 'show')
                    scope.dispatchEvent({type: 'IeecloudTableEditRenderer.hideCriteria', value: e.node});
                    break;
                case 'delete':
                    scope.dispatchEvent({type: 'IeecloudTableEditRenderer.deleteCriteria', value: e.node});
                    break;
                case 'show':
                    e.event.target.textContent = "Скрыть";
                    e.event.target.setAttribute('data-action-type', 'hide')
                    scope.dispatchEvent({type: 'IeecloudTableEditRenderer.showCriteria', value: e.node});
                    break;
            }
        }
    }

    getData(){
        let allRows = [];
        this.#gridOptions.api.forEachNodeAfterFilter((rowNode) => allRows.push(rowNode));
        return allRows;
    }

    resetInputRow() {
        this.#activeMasterCellValue = {};
        this.#setInputRow({});
    }

    clearData() {
        const rowData = [];
        this.#gridOptions.api.forEachNode(function (node) {
            rowData.push(node.data);
        });
        this.#gridOptions.api.applyTransaction({
            remove: rowData,
        });

        this.#rowData = [];
        this.resetInputRow();
    }

    removeCriteria(rowId) {
        this.#gridOptions.api.applyTransaction({ remove: [ this.#gridOptions.api.getRowNode(rowId).data ] });
    }

    // removeSelected(){
    //     const selectedRowNodes = this.#gridOptions.api.getSelectedNodes();
    //     const selectedIds = selectedRowNodes.map(function (rowNode) {
    //         return rowNode.id;
    //     });
    //     this.#rowData = this.#rowData.filter(function (dataItem) {
    //         return selectedIds.indexOf(dataItem.symbol) < 0;
    //     });
    //     this.#gridOptions.api.setRowData(this.#rowData);
    // }

    #isPinnedRowDataCompleted(params) {
        const scope = this;
        if (params.rowPinned !== 'top') return;
        return scope.#gridOptions.columnDefs.every((def) => {
            if (def.field === 'actions') {
                return true;
            }
            return scope.#inputRow[def.field]
        });
    }


}