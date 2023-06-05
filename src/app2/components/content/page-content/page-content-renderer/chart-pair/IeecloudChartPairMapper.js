import {groupBy} from "lodash-es";

export default class IeecloudChartPairMapper {

    #mapColor = {
        1: "#003f5c",
        2: "#665191"
        // ['tilt_y' + 'left']: "#d45087",
        // ['tilt_y' + 'right']: "#e67f83",
    }

    mapColumns(dataSchema) {
        let result = {};
        result.schema = dataSchema;
        return result;

    }

    mapData(response, dataSchema) {
        const scope = this;

        let eventsData = [];

        let columns = []
        const rowData = [];
        let columnDefs = dataSchema.properties;
        columnDefs.forEach(function (column) {
            columns.push(column.code)
        })

        response.data.forEach(function (rowArray) {
            let row = {};
            rowArray.forEach(function (item, index) {
                row[columns[index]] = item;
            })
            rowData.push(row)
        });

        console.log("sssssssss", rowData)

        const groupedRowData = groupBy(rowData, row => row.edate);

        console.log(groupedRowData)

        for (let time in groupedRowData) {

            const serverEvents = groupedRowData[time];
            let uiEvents = [];
            serverEvents.forEach(function (initialEvent) {
                uiEvents.push({
                    id: initialEvent.id,
                    name: initialEvent.name,
                    typeId : initialEvent.type_id,
                    typeName : initialEvent.type_name,
                    bgColor: scope.#mapColor[initialEvent.type_id],
                    borderColor: scope.#mapColor[initialEvent.type_id]
                })
            });

            const unixTimestamp = parseInt(time)
            const milliseconds = unixTimestamp * 1000 // 1575
            eventsData.push({
                time: milliseconds,
                events: uiEvents
            });

        }

        return eventsData;

    }
}