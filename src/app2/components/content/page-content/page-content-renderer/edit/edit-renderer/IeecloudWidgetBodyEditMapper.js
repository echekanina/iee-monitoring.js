import IeecloudAppUtils from "../../../../../../main/utils/IeecloudAppUtils.js";

export default class IeecloudWidgetBodyEditMapper {

    mapColumns(tableScheme) {
        const scope = this;
        let result = {};

        const columnsDefs = [];
        tableScheme.properties.forEach(function (props) {
            let item = {title: props.name, field: props.code, width:150};
            if (props.type === 'date') {
                item.type = 'date';
            } else if(props.type === 'str'){
                item.type = 'text';
            }else if(props.type === 'real'){
                item.type = 'numeric';
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
            columns.push({field : column.field, type: column.type})
        })

        result.data.forEach(function (rowArray) {
            let row = {};
            rowArray.forEach(function (item, index) {
                row[columns[index].field] = columns[index].type === 'date' ?
                    IeecloudAppUtils.convertUnixTimeToHumanDateWitFormat(item, "ru-RU", 'DD.MM.YYYY HH:mm')
                    : item;
            })
            rowData.push(row)
        });
        return rowData;
    }
}