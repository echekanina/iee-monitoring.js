import vertexMap from './mock/vertexMap.json'

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

    mapData(response, columnDefs) {
        const rowData = [];
        response.data.forEach(function (rowArray) {
            let row = {};
            columnDefs.interestedColumns.forEach(function (column, index) {
                row[column.field] = rowArray[column.index];
                if (column.field === "id") {

                    const key = Object.keys(vertexMap).find(key => vertexMap[key] === row[column.field] + "");
                    row["vertex"] = key;
                }

                if (column.field === "state") {
                    let color = 'bg-primary';
                    if (row[column.field] === 'norm') {
                        color = {r: 0, g: 255, b: 0};
                    }
                    if (row[column.field] === 'emergency') {
                        color = {r: 223, g: 69, b: 52};
                    }
                    if (row[column.field] === 'warn') {
                        color = {r: 223, g: 180, b: 52};
                    }
                    row["color"] = color;
                }
            });
            rowData.push(row)
        });
        return rowData;

    }
}