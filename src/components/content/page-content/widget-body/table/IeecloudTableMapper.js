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