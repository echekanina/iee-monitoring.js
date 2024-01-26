import {groupBy, isString} from "lodash-es";
import IeecloudAppUtils from "../../../../../../main/utils/IeecloudAppUtils.js";
import IeecloudAutoCompleteCellEditor
    from "../../../page-content-renderer/view/table-edit/IeecloudAutoCompleteCellEditor.js";
import IeecloudActionsCellRenderer from "../../../page-content-renderer/view/table-edit/IeecloudActionsCellRenderer.js";
import {v4 as uuidv4} from "uuid";
import IeecloudColorPickerCellEditor
    from "../../../page-content-renderer/view/table-edit/IeecloudColorPickerCellEditor.js";

export default class IeecloudChartOneMapper {

    mapColumns(dataSchema) {
        let result = {};
        result.schema = dataSchema;
        return result;

    }

    mapCriteriaItemColumns(response, dataSchema) {
        const rowData = [];
        response.data.forEach(function (rowArray) {
            let row = {};
            dataSchema.interestedColumns.forEach(function (column, index) {
                row[column.field] = rowArray[column.index];
            });
            rowData.push(row)
        });

        return rowData;
    }

    mapCriteriaColumns(dataSchema) {
        let result = [];
        dataSchema.properties.forEach(function (item) {
            if (item.hasOwnProperty("repo_code")) {
                result.push(item);
            }
        })
        return result;
    }

    mapTableColumns(tableScheme, service) {
        let result = {};
        const scope = this;


        const columnsDefs = [];
        tableScheme.properties.forEach(function (props) {
            if (props.hasOwnProperty("repo_code")) {
                let item = {
                    headerName: props.name,
                    field: props.code,
                    repoCode: props.repo_code,
                    tooltipValueGetter: (params) =>  `${params.value?.name ? params.value?.name : 
                        params.value ? params.value : ''}`,
                    headerTooltip: props.name,
                    valueFormatter: function (params) {
                        return scope.#isEmptyPinnedCell(params)
                            ? scope.#createPinnedCellPlaceholder(params)
                            : params.value?.name ? params.value?.name : params.value;
                    }
                };
                if (props.code !== 'pointId' && props.code !== 'actions' && props.code !== 'colorChart') {
                    item.cellEditor = IeecloudAutoCompleteCellEditor
                    item.cellEditorParams = {
                        valuesGetFunction: service.getCriteriaAutoCompleteValues,
                        valuesGetFunctionParams: {
                            repoCode: props.repo_code,
                            viewCode: props.view_code,
                            model: props.code
                        },
                        caller: service,
                        filterFields: props.filter_fields,
                        masterField: 'pointId'
                    }
                } else if (props.code === 'colorChart') {
                    item.cellEditor = IeecloudColorPickerCellEditor;
                    item.cellEditorParams = {
                        masterField: 'pointId'
                    }
                    item.cellStyle =  params => {
                        if (params.value && isString(params.value) && params.value.trim().length > 0) {
                            return {color: params.value, backgroundColor: params.value};
                        }
                        return null;
                    }
                } else {
                    item.editable = false;
                }

                if(props.code === 'actions'){
                    item.cellRenderer = IeecloudActionsCellRenderer
                    item.cellRendererParams = {
                        regular : {
                            buttonsMetaData: [{
                                name: "Скрыть",
                                uuid: uuidv4(),
                                actionType: "hide"
                            },
                                {
                                    name: "Удалить",
                                    uuid: uuidv4(),
                                    actionType: "delete"
                                }]
                        },
                        pinned : {
                            buttonsMetaData: [{
                                name: "Добавить",
                                uuid: uuidv4(),
                                actionType: "plus"
                            }]
                        }


                    }
                }

                if (IeecloudAppUtils.isMobileDevice()) {
                    item.suppressMovable = true; // turn off move table columns for mobile
                }
                columnsDefs.push(item);
            }
        });

        result.columnDefs = columnsDefs;
        return result;
    }

    #createPinnedCellPlaceholder({colDef}) {
        if (colDef.field === 'pointId') {
            return 'Выберите в дереве слева';
        } else if (colDef.field === 'actions') {
            return '';
        } else {
            return colDef.headerName[0].toUpperCase() + colDef.headerName.slice(1) + '...';
        }

    }

    #isEmptyPinnedCell({node, value}) {
        return (
            (node.rowPinned === 'top' && value == null) ||
            (node.rowPinned === 'top' && value === '')
        );
    }


    mapCriteriaSchemeColumns(dataSchema) {
        const result = {
            interestedColumns: []
        };

        dataSchema.properties.forEach(function (property, index) {

            if (property.code === 'code') {
                result.interestedColumns.push({
                    index: index,
                    field: "id"
                });
            } else if (property.code === 'name') {
                result.interestedColumns.push({
                    index: index,
                    field: property.code
                });
            }

        });
        return result;
    }

    mapData(response, dataSchema) {
        const scope = this;

        let eventsData = [];

        let columns = []
        const rowData = [];
        let columnDefs = dataSchema.properties;
        columnDefs.forEach(function (column) {
            columns.push(column.code)
        })

        response.data.forEach(function (rowArray) {
            let row = {};
            rowArray.forEach(function (item, index) {
                row[columns[index]] = item;
            })
            rowData.push(row)
        });


        const groupedRowData = groupBy(rowData, row => row.edate);


        for (let time in groupedRowData) {

            const serverEvents = groupedRowData[time];
            let uiEvents = [];
            serverEvents.forEach(function (initialEvent) {
                uiEvents.push({
                    id: initialEvent.id,
                    name: initialEvent.descr,
                    typeId: initialEvent.type_id,
                    typeName: initialEvent.type_name,
                    bgColor: initialEvent.bgColor ? initialEvent.bgColor : IeecloudAppUtils.dynamicColors(),
                    borderColor: initialEvent.borderColor ? initialEvent.borderColor : IeecloudAppUtils.dynamicColors()/*
                    imageUrl: 'https://i.stack.imgur.com/Q94Tt.png'*/
                })
            });

            const unixTimestamp = parseInt(time)
            const milliseconds = unixTimestamp * 1000 // 1575
            eventsData.push({
                time: milliseconds,
                events: uiEvents
            });

        }

        return eventsData;

    }


}