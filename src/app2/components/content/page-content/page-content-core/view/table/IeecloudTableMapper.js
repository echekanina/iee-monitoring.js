import moment from "moment";
import IeecloudAppUtils from "../../../../../../main/utils/IeecloudAppUtils.js";

export default class IeecloudTableMapper {

    mapColumns(tableScheme) {
        const scope = this;
        let result = {};

        const columnsDefs = [];
        tableScheme.properties.forEach(function (props) {
            let item = {headerName: props.name, field: props.code, tooltipField: props.code, headerTooltip: props.name};
            if (IeecloudAppUtils.isMobileDevice()) {
                item.suppressMovable = true; // turn off move table columns for mobile
            }
            if (props.type === 'date') {
                item.valueFormatter = function (params) {
                    // return moment.unix(params.value).calendar();
                    return IeecloudAppUtils.convertUnixTimeToHumanDateWitFormat(params.value, "ru-RU", 'DD.MM.YYYY HH:mm');
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
                    return `<div class="badge ` + clazz + ` text-white rounded-pill">` + params.value + `</div>`;
                };
            }
            columnsDefs.push(item);


        });

        result.columnDefs = columnsDefs;
        return result;
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
                row[columns[index]] = item;
            })
            rowData.push(row)
        });
        return rowData;
    }
}