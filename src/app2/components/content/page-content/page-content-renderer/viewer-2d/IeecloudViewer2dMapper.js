import coords from './mock/coords.json'

export default class IeecloudViewer2dMapper {
    mapColumns(dataSchema) {
        const result = {
            interestedColumns: []
        };

        dataSchema.properties.forEach(function (property, index) {

            if (property.code === 'state') {
                result.interestedColumns.push({
                    index: index,
                    field: property.code
                });
            } else if (property.code === 'id') {
                result.interestedColumns.push({
                    index: index,
                    field: property.code
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

    mapData(response, columnDefs) {
        const rowData = [];
        response.data.forEach(function (rowArray) {
            let row = {};
            columnDefs.interestedColumns.forEach(function (column, index) {
                row[column.field] = rowArray[column.index];
                if (column.field === "id") {
                    row["coordsData"] = coords[row[column.field]];
                }
            });
            rowData.push(row)
        });
        return rowData;
    }
}