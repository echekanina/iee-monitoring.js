export default class IeecloudAlbumMapper {
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
            } else if (property.code === 'code') {
                result.interestedColumns.push({
                    index: index,
                    field: property.code
                });
            }

        });
        return result;

    }

    mapData(response, columnDefs, coords) {
        return [];
    }
}