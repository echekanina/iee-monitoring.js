import 'ag-grid-community/styles/ag-grid.css';
import './styles/ag-theme-ieemonitoring.scss';
import {Grid} from "ag-grid-community";
import {v4 as uuidv4} from "uuid";


export default class IeecloudTableEditRenderer {
    #node;
    #layoutModel;
    #gridOptions;
    #LIMIT_PAGE_SIZE = 30;
    #uuid;
    #inputRow = {};
    #rowData;

    constructor(node) {
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
        this.#inputRow = newData;
        this.#gridOptions.api.setPinnedTopRowData([this.#inputRow]);
    }

    setCellValue(colKey, value){
        const scope = this;
        const rowNode = this.#gridOptions.api.getPinnedTopRow(0);
        rowNode.setDataValue(colKey, value);
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
            rowSelection: 'multiple',
            rowMultiSelectWithClick: true,
            defaultColDef: {
                flex: 1,
                editable: true
            },

            getRowStyle: ({node}) =>
                node.rowPinned ? {'font-weight': 'bold', 'font-style': 'italic'} : 0,

            onCellEditingStopped: (params) => {
                if (scope.#isPinnedRowDataCompleted(params)) {
                    // save data
                    scope.#setRowData([...scope.#rowData, scope.#inputRow]);
                    //reset pinned row
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

    getData(){
        let allRows = [];
        this.#gridOptions.api.forEachNodeAfterFilter((rowNode) => allRows.push(rowNode));
        return allRows;
    }

    clearData(){
        const rowData = [];
        this.#gridOptions.api.forEachNode(function (node) {
            rowData.push(node.data);
        });
        this.#gridOptions.api.applyTransaction({
            remove: rowData,
        });

        this.#rowData = [];

    }

    removeSelected(){
        const selectedRowNodes = this.#gridOptions.api.getSelectedNodes();
        const selectedIds = selectedRowNodes.map(function (rowNode) {
            return rowNode.id;
        });
        this.#rowData = this.#rowData.filter(function (dataItem) {
            return selectedIds.indexOf(dataItem.symbol) < 0;
        });
        this.#gridOptions.api.setRowData(this.#rowData);
    }

    #isPinnedRowDataCompleted(params) {
        const scope = this;
        if (params.rowPinned !== 'top') return;
        return scope.#gridOptions.columnDefs.every((def) => scope.#inputRow[def.field]);
    }


}