import {groupBy} from "lodash-es";
import IeecloudAppUtils from "../../../../../../main/utils/IeecloudAppUtils.js";

export default class IeecloudChartPairMapper {

    #mapColor = {
        1: "#003f5c",
        2: "#665191",
        3: "#ff9f40"
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


        const groupedRowData = groupBy(rowData, row => row.edate);


        for (let time in groupedRowData) {

            const serverEvents = groupedRowData[time];
            let uiEvents = [];
            serverEvents.forEach(function (initialEvent) {
                uiEvents.push({
                    id: initialEvent.id,
                    name: initialEvent.descr,
                    typeId : initialEvent.type_id,
                    typeName : initialEvent.type_name,
                    bgColor: initialEvent.bgColor ? initialEvent.bgColor : IeecloudAppUtils.dynamicColors(),
                    borderColor: initialEvent.borderColor ? initialEvent.borderColor : IeecloudAppUtils.dynamicColors()/*
                    imageUrl: 'https://i.stack.imgur.com/Q94Tt.png'*/
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