import 'ag-grid-community/styles/ag-grid.css';
import './styles/ag-theme-ieemonitoring.scss';
import {Grid} from "ag-grid-community";
import {v4 as uuidv4} from "uuid";
import EventDispatcher from "../../../../../../main/events/EventDispatcher.js";
import {isFunction, isUndefined} from "lodash-es";
import IeecloudQueue from "../../../../../../main/utils/custom-objects/IeecloudQueue.js";
import * as agGrid from "ag-grid-community";

export default class IeecloudTableEditRenderer extends EventDispatcher{
    #node;
    #gridOptions;
    #uuid;
    #inputRow = {};
    #activeMasterCellValue = {};
    #defaultCellValue = {};
    #initialCellValues;
    #queue;
    #gridApi;

    constructor(node) {
        super();
        this.#node = node;
        this.#queue = new IeecloudQueue();
    }

    generateTemplate() {
        this.#uuid = uuidv4();
        return `<div id="myGrid-` + this.#uuid + `" style="height: 100%;width:100%;" class="ag-theme-custom"></div>`;
    }

    destroy() {
        if (this.#gridOptions) {
            this.#gridApi?.destroy();
        }
    }

    #setRowData(newData) {
        this.#gridApi.setRowData(newData);
    }

    #addRowData(newRow) {
        this.#gridApi.applyTransaction({add: [newRow]});
    }

    addRows(data) {
        this.#gridApi.applyTransaction({add: data});
    }

    #setInputRow(newData) {
        const scope = this;
        if (Object.keys(this.#activeMasterCellValue).length) {
            newData = {...newData, ...this.#activeMasterCellValue};
        }

        if (scope.#initialCellValues && scope.#initialCellValues.length > 0) {
            scope.#defaultCellValue = {};
            scope.#initialCellValues.forEach(function (item) {
                if (isFunction(item.value)) {
                    scope.#defaultCellValue[item.field] = item.value.call(item.caller);
                } else {
                    scope.#defaultCellValue[item.field] = item.value;
                }
            });
            newData = {...newData, ...this.#defaultCellValue};
        }

        this.#inputRow = newData;
        this.#gridApi.setPinnedTopRowData([this.#inputRow]);
    }

    setCellValue(colKey, value) {
        const scope = this;
        const rowNode = this.#gridApi.getPinnedTopRow(0);
        rowNode.setDataValue(colKey, value);
        scope.#activeMasterCellValue[colKey] = value;

        scope.#gridOptions.columnDefs.forEach(function (colDef) {
            if (colDef.cellEditor?.name === "IeecloudAutoCompleteCellEditor") {
                let funcMap = {};
                funcMap[colDef.field] = function () {
                    scope.#gridApi.startEditingCell({
                        rowIndex: rowNode.rowIndex,
                        colKey: colDef.field, rowPinned: rowNode.rowPinned,
                        key: 'programmatically' // workaround to distinguish who started edit
                    })
                }
                scope.#queue.enqueue(funcMap);
            }

        });

        scope.#doDefaultAutoCompleteSetValue();
    }

    render(container, columnDefs, defaultCellValues) {
        const scope = this;

        scope.#initialCellValues = defaultCellValues;

        defaultCellValues.forEach(function (item) {
            if (isFunction(item.value)) {
                scope.#defaultCellValue[item.field] = item.value.call(item.caller);
            } else {
                scope.#defaultCellValue[item.field] = item.value;
            }
        });

        scope.#inputRow = {...scope.#inputRow, ...scope.#defaultCellValue};
        scope.#gridOptions = {
            rowData: null,
            columnDefs: columnDefs,
            pinnedTopRowData: [scope.#inputRow],
            singleClickEdit : true,
            stopEditingWhenCellsLoseFocus  : false,
            tooltipShowDelay: 500,
            onRowClicked: (event) => scope.#onRowClick(event),
            defaultColDef: {
                flex: 1,
                editable: true
            },

            getRowStyle: ({node}) =>
                node.rowPinned ? {'font-weight': 'bold', 'font-style': 'italic'} : 0,

            onCellEditingStopped: (params) => {
                scope.#checkPinnedRowOnComplete(params);
                if (!isUndefined(scope.#queue.peek())) {
                    setTimeout(function(){
                        scope.#doDefaultAutoCompleteSetValue();
                    }, 100);

                }
            }
        };


        container.innerHTML = '';
        container.insertAdjacentHTML('beforeend', scope.generateTemplate());

        const eGridDiv = document.querySelector('#myGrid-' + this.#uuid);
        if (eGridDiv) {
            scope.#gridApi = agGrid.createGrid(eGridDiv, scope.#gridOptions);
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
                case 'plus':
                    scope.#addRowData(scope.#inputRow);
                    scope.#setInputRow(scope.#inputRow);
                    setTimeout(function(){
                        scope.#checkPinnedRowOnComplete({rowPinned : 'top'})
                    }, 50)

                    break;
            }
        }
    }

    #checkPinnedRowOnComplete(params){
        const scope = this;
        const columnDefAction = scope.#gridOptions.columnDefs.find(def => def.field === 'actions');
        const cellRendererInstances = scope.#gridApi.getCellRendererInstances();

        const cellRendererInstancePinnedRow = cellRendererInstances.find(instance =>
            instance.constructor.name === columnDefAction?.cellRenderer.name && instance.params.node.rowPinned);
        if (scope.#isPinnedRowDataCompleted(params)) {
            cellRendererInstancePinnedRow?.actionsRowPinnedEnable(true);
        } else {
            cellRendererInstancePinnedRow?.actionsRowPinnedEnable(false);
        }
    }

    #doDefaultAutoCompleteSetValue() {
        const scope = this;
        if (!scope.#queue.isEmpty) {
            const funcObject = scope.#queue.dequeue();
            Object.keys(funcObject).every((key) => {
                funcObject[key]();
            });
        }
    }

    getData(){
        let allRows = [];
        this.#gridApi.forEachNodeAfterFilter((rowNode) => allRows.push(rowNode));
        return allRows;
    }

    resetInputRow() {
        this.#activeMasterCellValue = {};
        this.#setInputRow({});
    }

    clearData() {
        const rowData = [];
        this.#gridApi.forEachNode(function (node) {
            rowData.push(node.data);
        });
        this.#gridApi.applyTransaction({
            remove: rowData,
        });

        this.resetInputRow();
    }

    removeCriteria(node) {
        this.#gridApi.applyTransaction({ remove: [ this.#gridApi.getRowNode(node.id).data ] });
    }

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