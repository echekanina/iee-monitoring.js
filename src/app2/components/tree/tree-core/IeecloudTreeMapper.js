export default class IeecloudTreeMapper {

    mapColumns(dataSchema) {
        const result = {
            parentColumns: [],
            stateColumns: [],
            idColumns: [],
            countNotNormColumns: []
        };
        dataSchema.properties.forEach(function (property, index) {

            if (property.code === 'state') {
                result.stateColumns.push({
                    index: index,
                    aliasName: property.code
                });
            } else if (property.code === 'id') {
                result.idColumns.push({
                    index: index,
                    aliasName: property.code
                });
            }else if (property.code === 'parent_id') {
                result.parentColumns.push({
                    index: index,
                    aliasName: property.code
                });
            }else if (property.code === 'countNotNorm') {
                result.countNotNormColumns.push({
                    index: index,
                    aliasName: property.code
                });
            }

        });
        result.isCleanData = dataSchema.isCleanData;
        return result;
    }

    mapData(response, columnDefs) {
        const result = {};

        for (let i = 0; i < response.data.length; i++) {

            columnDefs.idColumns.forEach(function (column, index) {

                const stateColumn = columnDefs.stateColumns[index];
                const parentColumn = columnDefs.parentColumns[index];
                const countNotNormColumn = columnDefs.countNotNormColumns[index];


                let id, text, state, parentId, countNotNorm;
                if (columnDefs.isCleanData) {
                    text = response.data[i][2];
                    id = response.data[i][0];
                    state = response.data[i][stateColumn?.index];
                    parentId = response.data[i][parentColumn?.index];
                    countNotNorm = response.data[i][countNotNormColumn?.index];
                } else {
                    text = response.data[i]['name'];
                    id = response.data[i]['id'];
                    state = response.data[i]['state'];
                    parentId = response.data[i]['parent_id'];
                    countNotNorm = response.data[i]['countNotNorm'];
                }

                if (state === 'norm') {
                    return false;
                }

                result[id] = {
                    "status": state,
                    "title": text,
                    "parent_id": parentId,
                    "countNotNorm": countNotNorm
                }
            });
        }

        if (Object.keys(result).length > 0) {
            return result;
        }
        return null;

    }
}