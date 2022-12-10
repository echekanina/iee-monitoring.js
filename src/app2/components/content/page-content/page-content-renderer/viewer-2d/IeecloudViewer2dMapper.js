import coords from './mock/coords.json'
import coordsData from './mock/coordsData.json'
import map from './mock/vertexMap.json'

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


        let mapCoords = {}
        for (let key in map) {
            console.log(key, map[key])

            for (let i = 0; i < coordsData.length; i++) {

                if (!coordsData[i].hasOwnProperty('id')) {
                    continue;
                }
                if (coordsData[i].id === key) {
                    mapCoords[map[key]] = {
                        "coords": {
                            "x": coordsData[i].x,
                            "y": coordsData[i].y
                        },
                        "name": key,
                        "groupId": map[key]
                    }
                }


            }


        }

        console.log(JSON.stringify(mapCoords))

        return rowData;
    }
}