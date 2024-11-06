import IeecloudAppUtils from "../../../../../../main/utils/IeecloudAppUtils.js";

export default class IeecloudAlbumMapper {
    mapColumns(dataSchema) {

        const result = {
            interestedColumns: []
        };

        dataSchema.properties.forEach(function (property, index) {

            if (property.code === 'name') {
                result.interestedColumns.push({
                    index: index,
                    field: property.code
                });
            } else if (property.code === 'cdate') {
                result.interestedColumns.push({
                    index: index,
                    field: property.code
                });
            }

        });

        return result;

    }

    mapData(response, dataSchema, nodeCode) {

        const rowData = [];
        response.data.forEach(function (rowArray) {
            let row = {};
            dataSchema.interestedColumns.forEach(function (column, index) {
                if (column.field === "cdate") {
                    row[column.field] = IeecloudAppUtils.convertUnixTimeToHumanDateWitFormat(rowArray[column.index], "ru-RU", 'DD.MM.YYYY HH:mm');
                    return false;
                }
                row[column.field] = rowArray[column.index];
            });
            // row["staticPath"] = response.staticPath;
            row["staticPath"] = response.staticPath  + nodeCode + "/";
            rowData.push(row)
        });



        return rowData;
    }
}