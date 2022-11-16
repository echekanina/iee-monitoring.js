import * as moment from 'moment';

export default class IeecloudTableMapper {

    mapColumns(result) {
        const columnsDefs = [];
        result.properties.forEach(function (props) {
            let item = {headerName: props.title, field: props.aliasName};
            if (props.type === 'date') {
                item.valueFormatter = function (params) {
                    return moment.unix(params.value).calendar();
                };
            }
            if (props.title === 'Состояние') {
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
            columnsDefs.push(item)
        });

        return columnsDefs;
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