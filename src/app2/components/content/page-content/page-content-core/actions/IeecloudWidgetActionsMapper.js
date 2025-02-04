export default class IeecloudWidgetActionsMapper {

    mapColumns(dataSchema) {
        const result = {
            interestedColumns: []
        };

        dataSchema.properties.forEach(function (property, index) {

            if (property.code === 'code') {
                result.interestedColumns.push({
                    index: index,
                    field: 'id'
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

    mapData(response, columnDefs, additionalField) {
        const rowData = [];
        response.data.forEach(function (rowArray) {
            let row = {};
            columnDefs.interestedColumns.forEach(function (column, index) {
                row[column.field] = rowArray[column.index];
                if(column.field === 'id'){
                    row[additionalField] = rowArray[column.index];
                }
            });
            rowData.push(row)
        });

        return rowData;
    }
}