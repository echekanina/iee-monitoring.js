import IeecloudAppUtils from "../../../../../../main/utils/IeecloudAppUtils.js";
import {filter, find, flatten, map, reject} from "lodash-es";

export default class IeecloudWidgetBodyEditMapper {

    mapColumns(tableScheme, nodeProps, mode) {
        const scope = this;
        let result = {};

        const columnsDefs = [];
        tableScheme.properties.forEach(function (props) {
            let item = {title: props.name, field: props.code};
            if (props.type === 'date') {
                item.type = 'date';
            } else if(props.type === 'str'){
                item.type = 'text';
            }else if(props.type === 'real'){
                item.type = 'numeric';
            }
            columnsDefs.push(item);
        });

        if(mode === 'NEW'){
            result.fixedFullFields = flatten(map(nodeProps.fixedFields, function(item){
                return filter(columnsDefs, item);
            }));

            result.columnDefs = reject(columnsDefs, (item) => find(result.fixedFullFields, { field: item.field }));
            return result;
        }
        result.columnDefs = columnsDefs;
        result.fixedFullFields = [];

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
                if(!columns[index]){
                    return;
                }
                row[columns[index].field] = columns[index].type === 'date' ?
                    IeecloudAppUtils.convertUnixTimeToHumanDateWitFormat(item, "ru-RU", 'DD.MM.YYYY HH:mm')
                    : item;
            })
            rowData.push(row)
        });
        return rowData;
    }
}