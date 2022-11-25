export default class IeecloudMapMapper {

    mapColumns(dataSchema) {
        const result = {
            addressColumns: [],
            stateColumns: [],
            idColumns: [],
        };
        dataSchema.properties.forEach(function (property, index) {

            if (property.type === 'address') {
                result.addressColumns.push({
                    index: index,
                    aliasName: property.aliasName
                });
            } else if (property.aliasName === 'state') {
                result.stateColumns.push({
                    index: index,
                    aliasName: property.aliasName
                });
            } else if (property.aliasName === 'id') {
                result.idColumns.push({
                    index: index,
                    aliasName: property.aliasName
                });
            }

        });
        result.isCleanData = dataSchema.isCleanData;
        return result;
    }

    mapData(response, columnDefs) {
        const result = [];
        const mapStates = {
            emergency: "redIcon",
            warn: "orangeIcon",
            norm: "greenIcon"
        }

        for (let i = 0; i < response.data.length; i++) {

            columnDefs.addressColumns.forEach(function (column, index) {

                const stateColumn = columnDefs.stateColumns[index];
                const idColumn = columnDefs.idColumns[index];

                let id, text, address, state, objId;
                if (columnDefs.isCleanData) {
                    address = response.data[i][column.index];
                    text = response.data[i][2];
                    id = response.data[i][0];
                    state = response.data[i][stateColumn.index];
                    objId = response.data[i][idColumn.index];
                } else {
                    address = response.data[i][column.aliasName];
                    text = response.data[i]['name'];
                    id = response.data[i]['id'];
                    state = response.data[i]['state'];
                    objId = response.data[i]['id'];
                }
                let icon = !state ? "greenIcon" : mapStates[state];
                result.push({
                    "id": id,
                    "latlng": JSON.parse(address),
                    "objId": objId,
                    "icon": icon,
                    "title": text
                });
            });
        }

        return result;
    }
}