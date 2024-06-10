import moment from "moment";
import IeecloudAppUtils from "../../../../../../main/utils/IeecloudAppUtils.js";

export default class IeecloudTableMapper {

    mapColumns(tableScheme) {
        const scope = this;
        let result = {};

        const columnsDefs = [];
        tableScheme?.properties.forEach(function (props) {
            let item = {
                headerName: props.name,
                field: props.code,
                tooltipField: props.code,
                headerTooltip: props.name
            };
            if (IeecloudAppUtils.isMobileDevice()) {
                item.suppressMovable = true; // turn off move table columns for mobile
            }
            if (props.type === 'date') {
                item.cellRenderer = function (params) {
                    return IeecloudAppUtils.convertUnixTimeToHumanDateWitFormat(params.value, "ru-RU", 'DD.MM.YYYY HH:mm');
                };
            }

            if (props.type === 'real' || props.type === 'int') {
                item.cellRenderer = function (params) {
                    return params.value?.toString();
                };
            }

            if (props.code === 'state' || props.code === 'get_state') {
                item.cellRenderer = function (params) {
                    let clazz = 'bg-primary';
                    if (params.value === 'norm') {
                        clazz = 'bg-success';
                    }
                    if (params.value === 'emergency') {
                        clazz = 'bg-danger';
                    }
                    if (params.value === 'warn') {
                        clazz = 'bg-warning';
                    }
                    return params.value ?
                        `<div class="badge ` + clazz + ` text-white rounded-pill">` + params.value + `</div>` : '';
                };
            }
            if(props.type === 'uri'){
                item.type = 'uri';
                item.cellRenderer= scope.#createHyperLink.bind(this);
            }

            if (tableScheme.sortField === props.code) {
                item.sort = tableScheme.sortDir;
            }

            columnsDefs.push(item);
        });

        result.columnDefs = columnsDefs;
        return result;
    }
    #createHyperLink(params) {
        return '<a href="'+params.value+'" target="_blank">Открыть</a>'
    }

    mapData(result, columnDefs) {
        let columns = []
        const rowData = [];
        columnDefs.forEach(function (column) {
            columns.push(column.field)
        })

        result.data.forEach(function (rowArray) {
            let row = {};
            rowArray.forEach(function (item, index) {
                if(!columns[index]){
                    return;
                }
                row[columns[index]] = item;
            })
            rowData.push(row)
        });
        return rowData;
    }
}