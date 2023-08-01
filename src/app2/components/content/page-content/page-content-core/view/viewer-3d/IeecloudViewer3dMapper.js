
export default class IeecloudViewer3dMapper {
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

    mapData(response, columnDefs, vertexMap) {
        const rowData = [];
        response.data.forEach(function (rowArray) {
            let row = {};
            columnDefs.interestedColumns.forEach(function (column, index) {
                row[column.field] = rowArray[column.index];
                if (column.field === "id") {

                    row["vertex"] = Object.keys(vertexMap).find(key => vertexMap[key] === row[column.field] + "");
                }

                if (column.field === "state") {
                    let color = 'bg-primary';
                    if (row[column.field] === 'norm') {
                        color = 0x00ac69;
                    }
                    if (row[column.field] === 'emergency') {
                        color = 0xE81500;
                    }
                    if (row[column.field] === 'warn') {
                        color = 0xf4a100;
                    }
                    row["color"] = color;
                }
            });
            rowData.push(row)
        });
        return rowData;

    }
}